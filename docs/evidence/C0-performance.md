# Evidence: C0-performance.md

## Scope
Performance smoke report for required backend actions (`/users/execute`, `/users/clear`) and baseline health route.

## Method

Environment used:
- backend running locally on `127.0.0.1:3201`
- temporary webhook mock on `127.0.0.1:7778` (fast deterministic responses)
- secure endpoint kept live (real network call in execute flow)

Command loop (10 samples each):
```bash
curl -s -o /dev/null -w "%{time_total}\n" http://127.0.0.1:3201/health
curl -s -o /dev/null -w "%{time_total}\n" -X POST http://127.0.0.1:3201/users/execute -H 'content-type: application/json' -d '{}'
curl -s -o /dev/null -w "%{time_total}\n" -X POST http://127.0.0.1:3201/users/clear -H 'content-type: application/json' -d '{}'
```

## Results (10 samples)

| Endpoint | Min (ms) | Avg (ms) | P95 (ms) | Max (ms) |
|---|---:|---:|---:|---:|
| `GET /health` | 0.412 | 0.974 | 4.721 | 4.721 |
| `POST /users/execute` | 1284.636 | 1398.288 | 2210.098 | 2210.098 |
| `POST /users/clear` | 0.884 | 1.296 | 1.785 | 1.785 |

## Interpretation
- `execute` is significantly slower because it includes a live fetch + AES decrypt path.
- `clear` is near-instant in local setup due lightweight webhook response.
- No timeout/retry exhaustion observed in this smoke run.

## Suggested budget (local baseline)
- `GET /health`: `< 50 ms`
- `POST /users/clear`: `< 200 ms`
- `POST /users/execute`: `< 3000 ms` (depends on secure endpoint network latency)

