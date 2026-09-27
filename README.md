# Windfall — Razorpay Standard Checkout

Static site (`index.html`) + two serverless functions (`/api`). No server to run
yourself — Vercel hosts the functions for free.

## Deploy (free, no card required)

1. Put this folder in a GitHub repo (or use the Vercel CLI to deploy the folder
   directly — `npx vercel` from inside it, no git needed).
2. Go to vercel.com → **Add New Project** → import the repo (or confirm the CLI deploy).
3. Before the first deploy finishes, open **Project Settings → Environment Variables**
   and add:
   - `RAZORPAY_KEY_ID` = `rzp_test_Th1cGcbUV5RxpI`
   - `RAZORPAY_KEY_SECRET` = *(the secret you have — type it directly into Vercel's
     dashboard, don't paste it into any file in the repo)*
4. Deploy. Vercel automatically turns `api/create-order.js` and
   `api/verify-payment.js` into live endpoints at `/api/create-order` and
   `/api/verify-payment`.

## Test it

Your key starts with `rzp_test_`, so no real money moves yet.

1. Open your deployed URL, click **Subscribe**.
2. In the Razorpay modal, pay with a test card: `4111 1111 1111 1111`, any future
   expiry, any CVV, any OTP screen just continues.
3. You should see "Payment confirmed — you're subscribed." on the page.
4. Try dismissing the modal partway through, and try a failing test card
   (Razorpay's docs list one) to see the failure states.

## Going live later

Once you're ready to take real payments: in your Razorpay dashboard, complete
KYC, switch to **Live mode**, generate a live key pair, and swap
`RAZORPAY_KEY_ID` in `index.html` plus both env vars in Vercel for the live
values. Nothing else changes.

## Files

- `index.html` — the site; Subscribe button opens the Razorpay modal
- `api/create-order.js` — creates a Razorpay order (amount, currency)
- `api/verify-payment.js` — checks the payment signature before treating it as paid
- `.env.example` — placeholder only; real secret goes in Vercel's dashboard, not here
- `package.json` — lists the `razorpay` SDK Vercel will install on deploy
