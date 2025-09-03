# 🔐 Ko Lake Villa - Manual Secrets Backup Guide

## STEP 1: Access Replit Secrets
1. In your Replit project, look for **"Secrets"** in the left sidebar
2. Or click the **lock icon 🔒** in the top menu
3. This opens the Secrets panel with all your environment variables

## STEP 2: Copy Each Secret (DO THIS NOW!)

Create a `.env` file with these values from your Replit Secrets:

```bash
# === FIREBASE CONFIGURATION ===
NEXT_PUBLIC_FIREBASE_API_KEY=[Copy from Replit Secrets]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[Copy from Replit Secrets]
NEXT_PUBLIC_FIREBASE_PROJECT_ID=[Copy from Replit Secrets]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[Copy from Replit Secrets]
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[Copy from Replit Secrets]
NEXT_PUBLIC_FIREBASE_APP_ID=[Copy from Replit Secrets]

# === FIREBASE ADMIN (Server-side) ===
FIREBASE_PRIVATE_KEY=[Copy from Replit Secrets - CRITICAL]
FIREBASE_CLIENT_EMAIL=[Copy from Replit Secrets]
FIREBASE_PROJECT_ID=[Copy from Replit Secrets]

# === DATABASE ===
DATABASE_URL=[Copy from Replit Secrets - PostgreSQL connection]

# === PAYMENT PROCESSING ===
STRIPE_SECRET_KEY=[Copy from Replit Secrets]
STRIPE_WEBHOOK_SECRET=[Copy from Replit Secrets]

# === PROPERTY MANAGEMENT ===
GUESTY_CLIENT_ID=[Copy from Replit Secrets]
GUESTY_CLIENT_SECRET=[Copy from Replit Secrets]

# === SESSION & SECURITY ===
SESSION_SECRET=[Copy from Replit Secrets]

# === AI SERVICES ===
OPENAI_API_KEY=[Copy from Replit Secrets]
```

## STEP 3: Save Securely
1. Copy each value exactly as shown in Replit Secrets
2. Save as `.env` file for deployment
3. Store backup in password manager
4. Include these files in your ZIP download

## STEP 4: Verify After Migration
Test these services work in your new environment:
- ✅ Firebase (Gallery uploads)
- ✅ Database (PostgreSQL connection)
- ✅ Stripe (Payments)
- ✅ Guesty (Property management)
- ✅ OpenAI (AI features)

⚠️ **SECURITY WARNING**: Never commit `.env` to public repositories!