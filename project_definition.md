# QuizBiz Worker Deployment Receipt

- **Worker Name/ID**: quizbiz-worker / 0144ae69-1ecb-4566-a135-77a8bdeec65e
- **Live URL**: https://quizbiz.org
- **Wrangler Config**:
  ```json
  {
    "name": "quizbiz-worker",
    "main": "src/index.js",
    "compatibility_date": "2024-01-01",
    "env": {
      "production": {
        "name": "quizbiz-worker"
      }
    },
    "routes": [
      {
        "pattern": "quizbiz.org",
        "custom_domain": true
      }
    ]
  }
  ```
- **Smoke Test**: Passed - Hero content visible at quizbiz.org.
- **Custom Domain**: Attached (quizbiz.org).
- **Bindings**: None required for simple worker.
- **Deploy Script**: `wrangler deploy --config wrangler.json --env production`