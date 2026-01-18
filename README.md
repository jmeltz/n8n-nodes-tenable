# n8n-nodes-tenable

This package provides n8n community nodes for interacting with Tenable APIs:

- **Tenable Vulnerability Management** - Full-featured node for vulnerability scanning, asset management, and security assessments
- **Tenable One** - Node for Tenable One Exposure Management platform

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-tenable`
4. Agree to the risks and select **Install**

### Manual Installation

```bash
npm install n8n-nodes-tenable
```

## Credentials

Both nodes use the same Tenable API credentials:

1. In n8n, go to **Credentials > New**
2. Search for "Tenable API"
3. Enter your Tenable API credentials:
   - **Access Key**: Your Tenable API access key
   - **Secret Key**: Your Tenable API secret key
   - **Base URL**: Usually `https://cloud.tenable.com`

To generate API keys, go to your Tenable.io account settings.

## Tenable Vulnerability Management Node

### Resources & Operations

#### Scan
- **Create** - Create a new scan configuration
- **Delete** - Delete a scan
- **Get** - Get scan details
- **Get Many** - List all scans
- **Launch** - Launch a scan
- **Pause** - Pause a running scan
- **Resume** - Resume a paused scan
- **Stop** - Stop a running scan

#### Asset
- **Get** - Get asset details
- **Get Many** - List all assets
- **Import** - Import assets

#### Export
- **Start Assets Export** - Start an assets export job
- **Start Vulnerabilities Export** - Start a vulnerabilities export job
- **Start Compliance Export** - Start a compliance export job
- **Get Status** - Get export job status
- **Cancel** - Cancel an export job
- **Download Chunk** - Download an export chunk

#### Folder
- **Create** - Create a folder
- **Delete** - Delete a folder
- **Get Many** - List all folders
- **Update** - Rename a folder

#### Plugin
- **Get** - Get plugin details
- **Get Families** - List all plugin families
- **Get Family Plugins** - List plugins in a family

#### Policy
- **Copy** - Copy a policy
- **Create** - Create a policy
- **Delete** - Delete a policy
- **Get** - Get policy details
- **Get Many** - List all policies

#### Vulnerability
- **Get Many** - List vulnerabilities

#### Workbench
- **Get Assets** - Get assets from workbench
- **Get Asset Info** - Get detailed asset information
- **Get Asset Vulnerabilities** - Get vulnerabilities for an asset
- **Get Vulnerabilities** - Get vulnerabilities from workbench

## Tenable One Node

### Resources & Operations

#### Attack Path
- **Search Attack Paths** - Search for top attack paths
- **Search Attack Techniques** - Search for top attack techniques (MITRE ATT&CK)

#### Exposure View
- **Get Cards** - Get all exposure view cards
- **Get Card** - Get a specific card

#### Inventory
- **Search Assets** - Search for assets
- **Search Findings** - Search for findings
- **Search Software** - Search for software
- **Get Asset Properties** - Get available asset properties for filtering
- **Get Finding Properties** - Get available finding properties
- **Get Software Properties** - Get available software properties

#### Inventory Export
- **Start Assets Export** - Start an assets export
- **Start Findings Export** - Start a findings export
- **Get Status** - Get export status
- **Get Export Status** - Get specific export status
- **Download Chunk** - Download an export chunk

#### Tag
- **Search** - Search for tags
- **Get Properties** - Get available tag properties

## Query Examples

### Tenable One Inventory Search (Advanced Mode)

Find cloud assets with critical vulnerabilities:
```
Assets HAS sources = "CLOUD" WITH Weakness HAS severity = "Critical"
```

Find assets with high AES score:
```
Assets HAS aes >= 700
```

## License

MIT
