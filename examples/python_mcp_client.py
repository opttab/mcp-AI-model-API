"""
Opttab MCP API - Python Client Example
Complete MCP integration for AI models
"""

import requests
import json
from typing import Dict, List, Optional

class OpttabMCPClient:
    """Python client for Opttab MCP / AI Model API"""
    
    def __init__(self, api_key: str, api_secret: str, ai_model_name: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.ai_model_name = ai_model_name
        self.base_url = "https://opttab.com/api/v1/ai"
        self.headers = {
            "X-API-Key": api_key,
            "X-API-Secret": api_secret,
            "Content-Type": "application/json"
        }
    
    def get_server_info(self) -> Dict:
        """Get MCP server information and available tools"""
        response = requests.get(
            f"{self.base_url}/server-info",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def check_opt_status(self, user_id: int) -> Dict:
        """Check if a user has opted in for this AI model"""
        data = {
            "user_id": user_id,
            "ai_model": self.ai_model_name
        }
        response = requests.post(
            f"{self.base_url}/tools/check-opt-status",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_opted_in_content(
        self,
        content_type: str = "assets",
        limit: int = 100
    ) -> Dict:
        """Get content from users who have opted in"""
        data = {
            "ai_model": self.ai_model_name,
            "content_type": content_type,
            "limit": limit
        }
        response = requests.post(
            f"{self.base_url}/tools/get-opted-in-content",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_campaign_content(
        self,
        keywords: List[str] = None,
        limit: int = 20
    ) -> Dict:
        """Get active campaigns targeting this AI model"""
        data = {
            "keywords": keywords or [],
            "limit": limit
        }
        response = requests.post(
            f"{self.base_url}/tools/get-campaign-content",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_pending_campaigns(self) -> Dict:
        """Get campaigns awaiting approval"""
        response = requests.get(
            f"{self.base_url}/campaigns/pending",
            headers=self.headers,
            params={"ai_model": self.ai_model_name}
        )
        response.raise_for_status()
        return response.json()
    
    def approve_campaign(
        self,
        campaign_id: int,
        status: str,
        message: str = ""
    ) -> Dict:
        """Approve or reject a campaign"""
        data = {
            "campaign_id": campaign_id,
            "ai_model": self.ai_model_name,
            "status": status,  # "approved" or "rejected"
            "message": message
        }
        response = requests.post(
            f"{self.base_url}/campaigns/approve",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def update_campaign_metrics(
        self,
        campaign_id: int,
        impressions: int = 0,
        clicks: int = 0,
        conversions: int = 0,
        spent: float = 0.0
    ) -> Dict:
        """Update campaign performance metrics"""
        data = {
            "campaign_id": campaign_id,
            "ai_model": self.ai_model_name,
            "impressions": impressions,
            "clicks": clicks,
            "conversions": conversions,
            "spent": spent
        }
        response = requests.post(
            f"{self.base_url}/campaigns/metrics",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def create_content_request(
        self,
        title: str,
        description: str,
        content_types: List[str],
        payment_per_submission: float,
        total_budget: float,
        **kwargs
    ) -> Dict:
        """Create a new content request"""
        data = {
            "title": title,
            "description": description,
            "content_types": content_types,
            "payment_per_submission": payment_per_submission,
            "total_budget": total_budget,
            **kwargs
        }
        response = requests.post(
            f"{self.base_url}/content-requests",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def list_content_requests(self) -> Dict:
        """List all content requests"""
        response = requests.get(
            f"{self.base_url}/content-requests",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def get_submissions(self, request_id: int) -> Dict:
        """Get submissions for a content request"""
        response = requests.get(
            f"{self.base_url}/content-requests/{request_id}/submissions",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def review_submission(
        self,
        request_id: int,
        submission_id: int,
        action: str,
        review_notes: str = ""
    ) -> Dict:
        """Accept or reject a submission"""
        data = {
            "action": action,  # "accept" or "reject"
            "review_notes": review_notes
        }
        response = requests.post(
            f"{self.base_url}/content-requests/{request_id}/submissions/{submission_id}/review",
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_budget_status(self) -> Dict:
        """Get current quota and budget status"""
        response = requests.get(
            f"{self.base_url}/budget-status",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()


def main():
    """Example usage"""
    
    # Initialize client
    api_key = "opttab_ai_your_key"  # Replace with your API key
    api_secret = "your_secret_here"  # Replace with your secret
    ai_model_name = "OpenAI"  # Your AI model name
    
    client = OpttabMCPClient(api_key, api_secret, ai_model_name)
    
    try:
        # Get server info
        print("Getting server info...")
        server_info = client.get_server_info()
        print(f"MCP Server: {server_info['name']}")
        print(f"Available tools: {len(server_info['tools'])}")
        
        # Check opt status for a user
        print("\nChecking opt status for user...")
        opt_status = client.check_opt_status(user_id=123)
        print(f"Opt status: {opt_status['opt_status']}")
        print(f"Can use data: {opt_status['can_use_data']}")
        
        # Get opted-in content
        if opt_status['can_use_data']:
            print("\nFetching opted-in content...")
            content = client.get_opted_in_content(limit=10)
            print(f"Retrieved {len(content['data']['assets'])} assets")
        
        # Get pending campaigns
        print("\nFetching pending campaigns...")
        pending = client.get_pending_campaigns()
        print(f"Pending campaigns: {len(pending['pending_campaigns'])}")
        
        # Approve first campaign if any
        if pending['pending_campaigns']:
            campaign = pending['pending_campaigns'][0]
            print(f"\nApproving campaign: {campaign['name']}")
            approval = client.approve_campaign(
                campaign['id'],
                "approved",
                "Campaign meets our content guidelines"
            )
            print(f"Campaign status: {approval['campaign_status']}")
        
        # Create content request
        print("\nCreating content request...")
        content_request = client.create_content_request(
            title="High-Quality Product Photos",
            description="Looking for professional product photography",
            content_types=["image"],
            payment_per_submission=50.00,
            total_budget=1000.00,
            target_country="US"
        )
        print(f"Created request ID: {content_request['data']['id']}")
        
        # Check budget status
        print("\nChecking budget status...")
        budget = client.get_budget_status()
        print(f"Plan: {budget['data']['plan_name']}")
        print(f"Remaining budget: ${budget['data']['remaining_budget']}")
        
    except requests.exceptions.HTTPError as e:
        print(f"API Error: {e.response.status_code}")
        print(f"Response: {e.response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    main()

