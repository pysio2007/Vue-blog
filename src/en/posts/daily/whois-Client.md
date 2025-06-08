---
title: Available Whois Tools for Windows
date: 2025-06-09
icon: fa-solid fa-magnifying-glass
category: daily
tag:
  - BGP
  - Tools
---

I couldn't find a good whois tool for Windows, so I wrote a small and elegant tool that is now available through Winget.

```powershell
winget install Akaere.whois
```

Let me introduce this whois tool to you.

## Main Features

### 🎨 Smart Colored Output
The tool automatically detects output formats and applies corresponding color schemes:

- **RIPE Format**: AS numbers display in bright red, network information in bright cyan, organization contacts in bright green
- **BGP.tools Format**: Table headers in bold, AS numbers and IP addresses distinguished with different colors

### 🔗 Terminal Hyperlink Support
Clickable links are enabled by default for all RIR (Regional Internet Registry) database results:

- Supports all major RIRs: RIPE, ARIN, APNIC, LACNIC, AFRINIC
- AS numbers, IP ranges, organization information are all clickable
- Compatible with modern terminals: Windows Terminal, PowerShell, iTerm2, etc.

### 🌐 DN42 Network Support
Dedicated support for DN42 network queries:

- Automatically detects DN42 AS numbers (starting with AS42424xxxxx)
- Supports manual DN42 mode activation

## Example Commands

### Query IP Address

```powershell
whois 8.8.8.8
```

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/whoisgoogle.png)

### Query AS Number

```powershell
whois AS213605
```

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/whoispysio.png)

### Query DN42 AS Number

```powershell
whois 213605  # Default behavior: if an ASN exists in both DN42 and public networks, DN42 uses pure numbers while public networks use AS prefix
```
Note: DN42 hyperlinks have some issues and will be fixed in the next version

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/whoisdn42.png)

### Terminal Hyperlink Demonstration

Due to limitations, you'll need to try it yourself to see the full effect (x

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/hyperlinkgoogle.png)

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/hyperlinkasn.png)

Finally, here's the GitHub link. Welcome to star~ 

[Akaere-NetWorks/whois](https://github.com/Akaere-NetWorks/whois) 