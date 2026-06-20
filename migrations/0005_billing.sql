-- Lilt Pro (Stripe). is_pro gates the AI conversation tutor (unlimited for Pro;
-- free users get a small daily allowance). stripe_customer_id links a Stripe
-- subscription back to the account for webhook updates.
ALTER TABLE users ADD COLUMN is_pro INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
