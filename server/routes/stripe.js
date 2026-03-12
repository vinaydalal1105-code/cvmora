import Stripe from 'stripe'
import { verifyToken } from '../auth.js'
import * as db from '../db.js'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')

function resolvePriceId(billingCycle) {
  if (billingCycle === 'yearly' && process.env.STRIPE_PRICE_ID_YEARLY) {
    return process.env.STRIPE_PRICE_ID_YEARLY
  }
  return process.env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID || null
}

/**
 * POST /api/stripe/create-checkout-session
 * Body: { billingCycle?: 'monthly' | 'yearly', returnUrl?: string }
 * Returns: { url }
 */
export async function createCheckoutSession(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments are not configured' })
  }

  const billingCycle = req.body?.billingCycle === 'yearly' ? 'yearly' : 'monthly'
  const priceId = resolvePriceId(billingCycle)
  if (!priceId) {
    return res.status(503).json({ error: 'No Stripe price configured. Set STRIPE_PRICE_ID_MONTHLY or STRIPE_PRICE_ID.' })
  }

  const returnUrl = req.body?.returnUrl
  const successBase = returnUrl === 'pricing' ? '/pricing' : '/builder'

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  const userId = token ? verifyToken(token) : null
  const user = userId ? await db.getUserById(userId) : null

  try {
    let customerId = null
    if (user) {
      customerId = await db.getStripeCustomerId(userId)
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { cvmora_user_id: String(userId) },
        })
        customerId = customer.id
        await db.setStripeCustomerId(userId, customerId)
      }
    }

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}${successBase}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}${successBase}?checkout=cancel`,
      metadata: {
        ...(userId ? { cvmora_user_id: String(userId) } : {}),
        billing_cycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          ...(userId ? { cvmora_user_id: String(userId) } : {}),
        },
      },
    }

    if (customerId) {
      sessionParams.customer = customerId
    } else if (user) {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    res.json({ url: session.url })
  } catch (err) {
    console.error('[stripe] createCheckoutSession', err)
    res.status(500).json({ error: err.message || 'Failed to create checkout session' })
  }
}

/**
 * GET /api/stripe/verify-session?session_id=cs_xxx
 * Checks if a Checkout Session was paid. No auth required.
 * Returns: { paid: boolean }
 */
export async function verifySession(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments not configured' })
  }
  const sessionId = req.query.session_id
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'session_id is required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    res.json({ paid: session.payment_status === 'paid' })
  } catch (err) {
    console.error('[stripe] verifySession', err)
    res.status(400).json({ error: 'Invalid session', paid: false })
  }
}

/**
 * POST /api/stripe/customer-portal
 * Creates a Stripe Customer Portal session for managing subscriptions.
 * Requires authentication.
 * Returns: { url }
 */
export async function customerPortal(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payments not configured' })
  }

  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  const userId = token ? verifyToken(token) : null
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const customerId = await db.getStripeCustomerId(userId)
  if (!customerId) {
    return res.status(400).json({ error: 'No billing account found. Subscribe first.' })
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/pricing`,
    })
    res.json({ url: portalSession.url })
  } catch (err) {
    console.error('[stripe] customerPortal', err)
    res.status(500).json({ error: err.message || 'Failed to create portal session' })
  }
}

/** POST /api/stripe/webhook — Stripe webhook (must receive raw body) */
export async function stripeWebhook(req, res) {
  if (!stripe) {
    return res.status(503).send('Payments not configured')
  }
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.warn('[stripe] STRIPE_WEBHOOK_SECRET not set; webhook not verified')
    return res.status(400).send('Webhook secret not set')
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('[stripe] Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.cvmora_user_id
        if (userId) {
          await db.setSubscriptionStatus(Number(userId), 'active')
        }
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const userId = sub.metadata?.cvmora_user_id
        if (userId) {
          const status = sub.status === 'active' || sub.status === 'trialing' ? 'active' : 'free'
          await db.setSubscriptionStatus(Number(userId), status)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const userId = sub.metadata?.cvmora_user_id
        if (userId) {
          await db.setSubscriptionStatus(Number(userId), 'free')
        }
        break
      }
    }
  } catch (e) {
    console.error('[stripe] webhook handler error', e)
  }

  res.sendStatus(200)
}
