# Opttab MCP / AI Model API

<div align="center">
  <h1>🤖 Opttab</h1>

**Model Context Protocol API for AI Models**

Ethical access to user data • Campaign management • Content monetization

[![API Version](https://img.shields.io/badge/API%20Version-v1-blue)](https://opttab.com)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple)](https://modelcontextprotocol.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Documentation](https://opttab.com/dashboard/user/api-documentation/ai-model-api) • [Register as AI Model](https://opttab.com/ai-model/register) • [Support](mailto:ai-support@opttab.com)

</div>

---

## 🌟 What is MCP?

**Model Context Protocol (MCP)** is an open standard that enables AI models to ethically access and interact with user data based on **explicit consent** and **opt-in preferences**.

Opttab's MCP API allows AI models to:
- ✅ Access data from users who have **opted in**
- ✅ Manage advertising campaigns within AI responses
- ✅ Request specific content from users
- ✅ License and monetize user-generated content
- ✅ Track usage and provide fair compensation

---

## 🚀 Quick Start

```bash
# Get server information
curl -H "X-API-Key: opttab_ai_your_key" \
     -H "X-API-Secret: your_secret" \
     https://opttab.com/api/v1/ai/server-info

# Check user opt-in status
curl -X POST "https://opttab.com/api/v1/ai/tools/check-opt-status" \
     -H "X-API-Key: opttab_ai_your_key" \
     -H "X-API-Secret: your_secret" \
     -H "Content-Type: application/json" \
     -d '{"user_id": 123, "ai_model": "OpenAI"}'
```

---

## 📋 Table of Contents

- [Authentication](#-authentication)
- [MCP Tools](#-mcp-tools)
- [Campaign Management](#-campaign-management)
- [Content Monetization](#-content-monetization)
- [Usage Quotas](#-usage-quotas)
- [Ethical Guidelines](#-ethical-guidelines)
- [Integration Examples](#-integration-examples)

---

## 🔐 Authentication

### API Credentials

The AI Model API requires **both** API Key and Secret:

```bash
curl -H "X-API-Key: opttab_ai_your_api_key" \
     -H "X-API-Secret: your_secret_hash" \
     https://opttab.com/api/v1/ai/server-info
```

### Get Your Credentials

1. Register at [AI Model Portal](https://opttab.com/ai-model/register)
2. Complete AI model verification
3. Generate API credentials from dashboard
4. **⚠️ Important:** Save your secret immediately - it's only shown once!

### Security

- Use SHA-256 hashing for secrets in transit
- Store credentials securely (never in code)
- Rotate keys every 90 days
- Use environment variables

---

## 🛠️ MCP Tools

### Base URL
```
https://opttab.com/api/v1/ai
```

### 1️⃣ Server Info

Get available MCP tools and server capabilities.

```bash
GET /server-info
```

**Response:**
```json
{
  "name": "Opttab AI Access Server",
  "version": "1.0.0",
  "description": "Provides AI models with ethical access to user data",
  "tools": [
    {
      "name": "check_opt_status",
      "description": "Check user's opt-in/opt-out status",
      "input_schema": { ... }
    },
    {
      "name": "get_opted_in_content",
      "description": "Retrieve content from opted-in users",
      "input_schema": { ... }
    }
  ]
}
```

### 2️⃣ Check Opt Status

Check if a user has opted in for your AI model.

```bash
POST /tools/check-opt-status
```

**Request:**
```json
{
  "user_id": 123,
  "ai_model": "OpenAI"
}
```

**Response:**
```json
{
  "user_id": 123,
  "ai_model": "OpenAI",
  "global_opt_in": true,
  "assets_summary": {
    "total_assets": 10,
    "opted_in_assets": 8,
    "opted_out_assets": 2
  },
  "opt_status": "partially_opted_in",
  "can_use_data": true
}
```

**Opt Status Values:**
- `no_assets` - User has no assets
- `fully_opted_in` - All assets opted in
- `fully_opted_out` - All assets opted out
- `partially_opted_in` - Some assets opted in

### 3️⃣ Get Opted-In Content

Retrieve content from users who have opted in for your AI model.

```bash
POST /tools/get-opted-in-content
```

**Request:**
```json
{
  "ai_model": "OpenAI",
  "content_type": "assets",
  "limit": 100
}
```

**Response:**
```json
{
  "ai_model": "OpenAI",
  "content_type": "assets",
  "data": {
    "assets": [
      {
        "id": 45,
        "name": "Creative Portfolio",
        "category": "creative_work",
        "description": "Design portfolio website",
        "links": ["https://portfolio.example.com"],
        "fields": {},
        "user": {
          "id": 123,
          "name": "John Doe"
        },
        "created_at": "2025-10-15T10:00:00Z"
      }
    ]
  }
}
```

### 4️⃣ Get Campaign Content

Get active campaigns targeting your AI model for sponsored responses.

```bash
POST /tools/get-campaign-content
```

**Request:**
```json
{
  "keywords": ["tech", "innovation"],
  "target_audience": "developers",
  "limit": 20
}
```

**Response:**
```json
{
  "campaigns": [
    {
      "id": 78,
      "title": "Product Launch Campaign",
      "description": "Promote our new SaaS product",
      "is_sponsored": true
    }
  ]
}
```

---

## 🎯 Campaign Management

### Get Pending Campaigns

Retrieve campaigns awaiting your approval.

```bash
GET /campaigns/pending?ai_model=OpenAI
```

**Response:**
```json
{
  "ai_model": "OpenAI",
  "pending_campaigns": [
    {
      "id": 78,
      "name": "Q4 Product Launch",
      "objective": "awareness",
      "keywords": ["tech", "innovation", "SaaS"],
      "locations": ["US", "UK", "CA"],
      "devices": ["desktop", "mobile"],
      "budget_daily": 500.00,
      "total_budget": 15000.00,
      "asset": {
        "id": 99,
        "name": "Product Landing Page",
        "category": "product_listing"
      },
      "user": {
        "id": 456,
        "name": "Company Inc"
      },
      "approval_status": "pending",
      "created_at": "2025-10-20T09:00:00Z"
    }
  ]
}
```

### Approve/Reject Campaign

Approve or reject a campaign targeting your AI model.

```bash
POST /campaigns/approve
```

**Request:**
```json
{
  "campaign_id": 78,
  "ai_model": "OpenAI",
  "status": "approved",
  "message": "Campaign approved. Meets our content guidelines."
}
```

**Response:**
```json
{
  "success": true,
  "campaign_id": 78,
  "ai_model": "OpenAI",
  "status": "approved",
  "campaign_status": "active"
}
```

### Update Campaign Metrics

Report campaign performance metrics (impressions, clicks, conversions).

```bash
POST /campaigns/metrics
```

**Request:**
```json
{
  "campaign_id": 78,
  "ai_model": "OpenAI",
  "impressions": 1000,
  "clicks": 50,
  "conversions": 5,
  "spent": 250.00
}
```

**Response:**
```json
{
  "success": true,
  "campaign_id": 78,
  "ai_model": "OpenAI",
  "aggregated_metrics": {
    "impressions": 1000,
    "clicks": 50,
    "conversions": 5,
    "spent": 250.00,
    "ctr": 5.00,
    "conversion_rate": 10.00
  },
  "campaign_status": "active",
  "budget_remaining": 14750.00
}
```

---

## 💰 Content Monetization API

### Create Content Request

Request specific content from users (videos, images, text, audio).

```bash
POST /content-requests
```

**Request:**
```json
{
  "title": "High-Quality Sunset Beach Videos",
  "description": "Looking for 4K sunset videos filmed at beach locations",
  "content_types": ["video"],
  "categories": ["original_images"],
  "target_country": "US",
  "target_city": "Los Angeles",
  "target_gender": "any",
  "target_age_min": 18,
  "target_age_max": 65,
  "payment_per_submission": 75.00,
  "total_budget": 5000.00,
  "max_submissions": 50,
  "format_specifications": {
    "resolution": "4K",
    "duration": "30-60 seconds",
    "format": "MP4"
  },
  "expires_at": "2025-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content request created successfully",
  "data": {
    "id": 15,
    "title": "High-Quality Sunset Beach Videos",
    "status": "active",
    "remaining_budget": 5000.00,
    "submissions_count": 0,
    "created_at": "2025-10-20T10:00:00Z"
  }
}
```

### List Content Requests

Get all your content requests.

```bash
GET /content-requests
```

### Get Submissions

View submissions for a content request.

```bash
GET /content-requests/{id}/submissions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "request_id": 15,
      "user_id": 789,
      "status": "pending",
      "content_url": "https://storage.opttab.com/submissions/video123.mp4",
      "description": "Beautiful sunset at Venice Beach",
      "submitted_at": "2025-10-21T14:30:00Z"
    }
  ]
}
```

### Review Submission

Accept or reject a content submission.

```bash
POST /content-requests/{requestId}/submissions/{submissionId}/review
```

**Request:**
```json
{
  "action": "accept",
  "review_notes": "Perfect quality! Exactly what we needed."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission accepted and payment processed",
  "data": {
    "submission_id": 42,
    "status": "accepted",
    "payment_processed": true,
    "creator_earnings": 60.00,
    "platform_fee": 15.00,
    "total_payment": 75.00,
    "remaining_budget": 4925.00
  }
}
```

### Revenue Split

**80/20 Model:**
- **80%** → Content creator
- **20%** → Platform (infrastructure, payment processing, support)

Example: $75 payment
- Creator receives: **$60.00**
- Platform fee: **$15.00**

### Get Monetized Assets

Browse assets available for licensing.

```bash
GET /assets/monetized
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "Premium Image Dataset",
      "category": "original_images",
      "description": "10,000 high-quality product images",
      "monetization_model": "per_training",
      "price_per_training": 0.001,
      "user": {
        "id": 55,
        "name": "Professional Photographer"
      }
    }
  ]
}
```

### License Asset

License an asset for training or generation.

```bash
POST /assets/{id}/license
```

### Track Usage

Report usage of licensed assets.

```bash
POST /assets/{id}/usage
```

**Request:**
```json
{
  "usage_type": "training",
  "count": 1000
}
```

---

## 📊 Usage Quotas

| Tier | Price/Month | Req/Min | Req/Hour | Req/Day | Active Requests | Monthly Budget |
|------|------------|---------|----------|---------|----------------|----------------|
| **Starter** | Free | 60 | 1,000 | 10,000 | 5 | $5,000 |
| **Professional** | $99 | 120 | 5,000 | 50,000 | 20 | $25,000 |
| **Enterprise** | $499 | 300 | 15,000 | 150,000 | 100 | $100,000 |

### Check Your Quota

```bash
GET /budget-status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plan_name": "Professional",
    "active_requests": 8,
    "max_active_requests": 20,
    "current_budget_spent": 12500.00,
    "total_monthly_budget": 25000.00,
    "remaining_budget": 12500.00,
    "requests_per_minute": 120,
    "requests_per_hour": 5000,
    "requests_per_day": 50000
  }
}
```

---

## 🎯 Ethical Guidelines

### ✅ DO

- **Respect user consent** - Only access data from users who have explicitly opted in
- **Be transparent** - Clearly state how you'll use the data
- **Pay fairly** - Compensate creators appropriately for their content
- **Report accurately** - Track and report usage truthfully
- **Follow guidelines** - Adhere to content and usage policies
- **Secure data** - Implement proper security measures

### ❌ DON'T

- Access data without explicit user consent
- Use data beyond the stated purposes
- Scrape or cache opted-out content
- Share user data with unauthorized parties
- Manipulate metrics or reports
- Circumvent rate limits or quotas

### Best Practices

1. **Check opt status before every use** - User preferences may change
2. **Cache responsibly** - Respect opt-out requests immediately
3. **Attribution** - Credit creators when using their content
4. **Feedback loop** - Provide users visibility into how their data is used
5. **Privacy first** - Never expose personal information

---

## 🔗 Integration Examples

### Python

```python
import requests

API_KEY = "opttab_ai_your_key"
API_SECRET = "your_secret"
BASE_URL = "https://opttab.com/api/v1/ai"

headers = {
    "X-API-Key": API_KEY,
    "X-API-Secret": API_SECRET,
    "Content-Type": "application/json"
}

# Check opt status
def check_opt_status(user_id, ai_model):
    data = {
        "user_id": user_id,
        "ai_model": ai_model
    }
    response = requests.post(
        f"{BASE_URL}/tools/check-opt-status",
        headers=headers,
        json=data
    )
    return response.json()

# Get opted-in content
def get_opted_in_content(ai_model, content_type="assets", limit=100):
    data = {
        "ai_model": ai_model,
        "content_type": content_type,
        "limit": limit
    }
    response = requests.post(
        f"{BASE_URL}/tools/get-opted-in-content",
        headers=headers,
        json=data
    )
    return response.json()

# Usage
opt_status = check_opt_status(123, "OpenAI")
print(f"User opt status: {opt_status['opt_status']}")

if opt_status['can_use_data']:
    content = get_opted_in_content("OpenAI")
    print(f"Retrieved {len(content['data']['assets'])} assets")
```

### JavaScript (Node.js)

```javascript
const axios = require('axios');

const API_KEY = 'opttab_ai_your_key';
const API_SECRET = 'your_secret';
const BASE_URL = 'https://opttab.com/api/v1/ai';

const headers = {
  'X-API-Key': API_KEY,
  'X-API-Secret': API_SECRET,
  'Content-Type': 'application/json'
};

// Check opt status
async function checkOptStatus(userId, aiModel) {
  try {
    const response = await axios.post(
      `${BASE_URL}/tools/check-opt-status`,
      { user_id: userId, ai_model: aiModel },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Get opted-in content
async function getOptedInContent(aiModel, contentType = 'assets', limit = 100) {
  try {
    const response = await axios.post(
      `${BASE_URL}/tools/get-opted-in-content`,
      { ai_model: aiModel, content_type: contentType, limit },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Usage
(async () => {
  const optStatus = await checkOptStatus(123, 'OpenAI');
  console.log(`User opt status: ${optStatus.opt_status}`);
  
  if (optStatus.can_use_data) {
    const content = await getOptedInContent('OpenAI');
    console.log(`Retrieved ${content.data.assets.length} assets`);
  }
})();
```

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "error": "invalid_parameters",
  "message": "Invalid parameters provided",
  "details": {
    "user_id": ["The user_id field is required."]
  }
}
```

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| `401` | Invalid API credentials | Check your API key and secret |
| `403` | Campaign not targeted to your model | This campaign doesn't target your AI model |
| `403` | Quota exceeded | Upgrade your plan or wait for reset |
| `404` | Resource not found | Check the ID and try again |
| `422` | Validation failed | Review request parameters |
| `429` | Rate limit exceeded | Slow down requests |

---

## 📚 Additional Resources

- [Full API Documentation](https://opttab.com/dashboard/user/api-documentation/ai-model-api)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [AI Model Portal](https://opttab.com/ai-model)
- [Developer Community](https://community.opttab.com)
- [API Status](https://status.opttab.com)

---

## 💬 Support

Need help integrating the MCP API?

- 📧 Email: [ai-support@opttab.com](mailto:ai-support@opttab.com)
- 💬 Discord: [AI Developers Channel](https://discord.gg/opttab-ai)
- 📖 Docs: [opttab.com/docs/ai-api](https://opttab.com/docs/ai-api)
- 🐛 Issues: [GitHub Issues](https://github.com/opttab/mcp-AI-model-API/issues)

---

## 📄 License

This API documentation is provided under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ethical AI principles**

[Website](https://opttab.com) • [AI Model Portal](https://opttab.com/ai-model) • [Blog](https://opttab.com/blog) • [Twitter](https://twitter.com/opttab)

</div>

