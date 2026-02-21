# API

Base URL (local): `http://localhost:3001`

## GET /health
Returns backend liveness.

### Response 200
```json
{ "status": "ok" }
```

## POST /users/execute
Runs complete pipeline:
1. fetch encrypted payload from secure endpoint
2. decrypt AES-256-GCM
3. forward users to n8n ingest webhook
4. return persisted users payload

### Response 200 (example)
```json
{
  "users": [
    { "id": 1, "nome": "Ana", "email": "ana@example.com", "phone": "+55 11 90000-0001" }
  ]
}
```

## POST /users/clear
Triggers n8n clear webhook and returns confirmation.

### Response 200
```json
{ "cleared": true }
```

## POST /users/seed
Generates a fictitious dataset in backend and persists through n8n ingest + list flow.

### Request body
```json
{ "count": 20 }
```

Rules:
- `count` must be an integer between `1` and `200`.

### Response 200 (example)
```json
{
  "users": [
    { "id": 1, "nome": "Ana Silva", "email": "ana.silva.12345678@seed.local", "phone": "+55 11 910000001" }
  ]
}
```

## Error envelope
All handled errors return:
```json
{
  "error": {
    "code": "N8N_WEBHOOK_FAILED",
    "message": "Falha de rede ao chamar webhook do n8n",
    "details": {}
  }
}
```
