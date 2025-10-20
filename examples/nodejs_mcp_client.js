/**
 * Opttab MCP API - Node.js Client Example
 * Complete MCP integration for AI models
 */

const axios = require('axios');

class OpttabMCPClient {
  /**
   * Initialize the Opttab MCP API client
   * @param {string} apiKey - Your AI Model API key
   * @param {string} apiSecret - Your AI Model API secret
   * @param {string} aiModelName - Your AI model name (e.g., "OpenAI")
   */
  constructor(apiKey, apiSecret, aiModelName) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.aiModelName = aiModelName;
    this.baseURL = 'https://opttab.com/api/v1/ai';
    this.headers = {
      'X-API-Key': apiKey,
      'X-API-Secret': apiSecret,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get MCP server information and available tools
   */
  async getServerInfo() {
    const response = await axios.get(`${this.baseURL}/server-info`, { headers: this.headers });
    return response.data;
  }

  /**
   * Check if a user has opted in for this AI model
   * @param {number} userId - User ID to check
   */
  async checkOptStatus(userId) {
    const data = {
      user_id: userId,
      ai_model: this.aiModelName
    };
    const response = await axios.post(
      `${this.baseURL}/tools/check-opt-status`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Get content from users who have opted in
   * @param {string} contentType - Type of content ("assets", "studio", "all")
   * @param {number} limit - Maximum number of items to return
   */
  async getOptedInContent(contentType = 'assets', limit = 100) {
    const data = {
      ai_model: this.aiModelName,
      content_type: contentType,
      limit
    };
    const response = await axios.post(
      `${this.baseURL}/tools/get-opted-in-content`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Get active campaigns targeting this AI model
   * @param {string[]} keywords - Keywords to match
   * @param {number} limit - Maximum number of campaigns
   */
  async getCampaignContent(keywords = [], limit = 20) {
    const data = {
      keywords,
      limit
    };
    const response = await axios.post(
      `${this.baseURL}/tools/get-campaign-content`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Get campaigns awaiting approval
   */
  async getPendingCampaigns() {
    const response = await axios.get(`${this.baseURL}/campaigns/pending`, {
      headers: this.headers,
      params: { ai_model: this.aiModelName }
    });
    return response.data;
  }

  /**
   * Approve or reject a campaign
   * @param {number} campaignId - Campaign ID
   * @param {string} status - "approved" or "rejected"
   * @param {string} message - Optional message
   */
  async approveCampaign(campaignId, status, message = '') {
    const data = {
      campaign_id: campaignId,
      ai_model: this.aiModelName,
      status,
      message
    };
    const response = await axios.post(
      `${this.baseURL}/campaigns/approve`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Update campaign performance metrics
   * @param {number} campaignId - Campaign ID
   * @param {Object} metrics - Metrics object
   */
  async updateCampaignMetrics(campaignId, metrics) {
    const data = {
      campaign_id: campaignId,
      ai_model: this.aiModelName,
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      conversions: metrics.conversions || 0,
      spent: metrics.spent || 0.0
    };
    const response = await axios.post(
      `${this.baseURL}/campaigns/metrics`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Create a new content request
   * @param {Object} requestData - Content request data
   */
  async createContentRequest(requestData) {
    const response = await axios.post(
      `${this.baseURL}/content-requests`,
      requestData,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * List all content requests
   */
  async listContentRequests() {
    const response = await axios.get(
      `${this.baseURL}/content-requests`,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Get submissions for a content request
   * @param {number} requestId - Content request ID
   */
  async getSubmissions(requestId) {
    const response = await axios.get(
      `${this.baseURL}/content-requests/${requestId}/submissions`,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Review a submission
   * @param {number} requestId - Content request ID
   * @param {number} submissionId - Submission ID
   * @param {string} action - "accept" or "reject"
   * @param {string} reviewNotes - Optional review notes
   */
  async reviewSubmission(requestId, submissionId, action, reviewNotes = '') {
    const data = {
      action,
      review_notes: reviewNotes
    };
    const response = await axios.post(
      `${this.baseURL}/content-requests/${requestId}/submissions/${submissionId}/review`,
      data,
      { headers: this.headers }
    );
    return response.data;
  }

  /**
   * Get current quota and budget status
   */
  async getBudgetStatus() {
    const response = await axios.get(
      `${this.baseURL}/budget-status`,
      { headers: this.headers }
    );
    return response.data;
  }
}

// Example usage
async function main() {
  // Initialize client
  const apiKey = 'opttab_ai_your_key'; // Replace with your API key
  const apiSecret = 'your_secret_here'; // Replace with your secret
  const aiModelName = 'OpenAI'; // Your AI model name
  
  const client = new OpttabMCPClient(apiKey, apiSecret, aiModelName);

  try {
    // Get server info
    console.log('Getting server info...');
    const serverInfo = await client.getServerInfo();
    console.log(`MCP Server: ${serverInfo.name}`);
    console.log(`Available tools: ${serverInfo.tools.length}`);

    // Check opt status for a user
    console.log('\nChecking opt status for user...');
    const optStatus = await client.checkOptStatus(123);
    console.log(`Opt status: ${optStatus.opt_status}`);
    console.log(`Can use data: ${optStatus.can_use_data}`);

    // Get opted-in content
    if (optStatus.can_use_data) {
      console.log('\nFetching opted-in content...');
      const content = await client.getOptedInContent('assets', 10);
      console.log(`Retrieved ${content.data.assets.length} assets`);
    }

    // Get pending campaigns
    console.log('\nFetching pending campaigns...');
    const pending = await client.getPendingCampaigns();
    console.log(`Pending campaigns: ${pending.pending_campaigns.length}`);

    // Approve first campaign if any
    if (pending.pending_campaigns.length > 0) {
      const campaign = pending.pending_campaigns[0];
      console.log(`\nApproving campaign: ${campaign.name}`);
      const approval = await client.approveCampaign(
        campaign.id,
        'approved',
        'Campaign meets our content guidelines'
      );
      console.log(`Campaign status: ${approval.campaign_status}`);
    }

    // Create content request
    console.log('\nCreating content request...');
    const contentRequest = await client.createContentRequest({
      title: 'High-Quality Product Photos',
      description: 'Looking for professional product photography',
      content_types: ['image'],
      payment_per_submission: 50.00,
      total_budget: 1000.00,
      target_country: 'US'
    });
    console.log(`Created request ID: ${contentRequest.data.id}`);

    // Check budget status
    console.log('\nChecking budget status...');
    const budget = await client.getBudgetStatus();
    console.log(`Plan: ${budget.data.plan_name}`);
    console.log(`Remaining budget: $${budget.data.remaining_budget}`);

  } catch (error) {
    if (error.response) {
      console.error(`API Error: ${error.response.status}`);
      console.error('Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = OpttabMCPClient;

