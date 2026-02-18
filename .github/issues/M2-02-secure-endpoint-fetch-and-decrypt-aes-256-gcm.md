Title: Fetch secure endpoint and decrypt AES-256-GCM payload (unit tested)
Milestone: M2 - Crypto + Backend Use Cases
Labels: backend,security,testing

## GitFlow Branch
- feature/M2-02-aes-gcm-decrypt

## Goal
Implement AES-256-GCM decryption logic to transform encrypted data into user records.

## Functional Requirements
- Implement a `SecureEndpointClient` that fetches the secure endpoint URL.
- Implement `Aes256GcmDecryptor` that:
  - reads ciphertext + IV + authTag + key from payload (format may be provided by endpoint)
  - returns decrypted JSON user list
- Add unit tests with a fixed fixture (do not depend on the live endpoint for unit tests)

## Non-Functional Requirements
- Fail closed: any crypto error must return a safe error.
- No secrets hardcoded.

## Acceptance Criteria
- Unit tests validate decryptor output for fixture.
- Live mode can decrypt from endpoint (manual evidence).

## Deliverables / Evidence
- `docs/evidence/M2-crypto.md` includes:
  - sample (redacted) payload shape
  - curl of secure endpoint (redacted secrets)
  - proof of decrypted result count
