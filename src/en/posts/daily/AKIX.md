---
title: Building an IXP - A Small Journal
date: 2025-05-05
icon: fa-solid fa-ethernet
category: daily
tag:
  - BGP
  - Daily
---

I've had my ASN for three months now, and I haven't been tinkering much lately. Recently, on a whim, I suddenly wanted to try building my own IXP.

## Why Bother with IXP?

Honestly, the initial motivation was simple - I just wanted to play. BGP, RPKI - these terms sound impressive, but only by actually doing it did I realize I could set it up myself. Plus, it can help friends' networks interconnect more easily, so why not?

- Wanted to deeply understand BGP and RPKI - just reading docs isn't enough, must practice
- Let small networks interconnect with low barriers, experience "the internet of the internet"
- Try remote virtual access, see if friends on the other side of the planet can easily connect

## Technology Selection and Pitfalls

From the start, I didn't plan to make it too complex - as long as it runs, interconnects, and is secure.

- Chose Bird for routing software - lightweight, easy to use, configuration not difficult
- Used VXLAN for switching, saves the hassle of physical switches, remote access is convenient too
- Set up my own RPKI RTR server for security
- Server in Frankfurt, rich European network resources, decent latency

The most troublesome part was actually remote virtual access, since not everyone can go to the data center to plug in a cable. VXLAN was a huge help - everyone just needs a public VPS to pull tunnels in.

## Build Log

### 1. Server and Network

First got a VPS that supports BGP, applied for IPv6 segment `2a14:67c1:a080::/48`. IPv4 is too expensive, IPv6 is really nice to use.

```bash
# Create IXP VXLAN interface
ip link add vxlan0 type vxlan id 10 dstport 4789 local 2a05:f480:1800:2e75:5400:05ff:fe65:88f3
ip addr add 2a14:67c1:a080::1/64 dev vxlan0
ip link set vxlan0 up
```

### 2. Bird Configuration

Bird is the core, responsible for BGP route exchange. Configuration is actually not as complex as imagined, mainly ASN filtering, RPKI validation, templating and peers.

```conf
router id 1.1.1.1;

# Define BOGON ASN filtering
define BOGON_ASNS = [
    0, 23456, 64496..64511, # ... other BOGON ASNs
];

define IX_PEERS = [
    213605, 213891, 151194, 198025, 210352
];

function ix_import() {
    if bgp_path.last ~ BOGON_ASNS then return false;
    if !check_roa_v6() then return false;
    return true;
}
```

Templated configuration makes adding members later very convenient:

```conf
template bgp ix_rs {
    local as 210440;
    multihop 2;
    ipv6 {
        import where ix_import();
        export where ix_export();
        next hop self;
        graceful restart on;
    };
}
```

### 3. RPKI Validation

Can't skip on security - set up my own RPKI validator, also pulled a backup from Cloudflare.

```conf
protocol rpki rpki_akae {
    roa4 { table roa_table_v4; };
    roa6 { table roa_table_v6; };
    remote "rpki.akae.re" port 8282;
    retry keep 90;
    refresh keep 43200;
    expire keep 86400;
}

protocol rpki rpki_cloudflare {
    roa4 { table roa_table_v4; };
    roa6 { table roa_table_v6; };
    remote "rtr.rpki.cloudflare.com" port 8282;
    retry keep 90;
    refresh keep 43200;
    expire keep 86400;
}

function check_roa_v6() {
    case roa_check(roa_table_v6, net, bgp_path.last) {
        ROA_VALID: return true;
        ROA_UNKNOWN: return true;
        ROA_INVALID: return false;
    }
}
```

### 4. PeeringDB Registration

After setting up, casually registered on PeeringDB:

- Organization: AKAERE NETWORKS TECHNOLOGY LTD
- Alias: Akaere IX
- Location: CN
- Region: Asia Pacific
- Service Level: Business Hours
- Website: [ixpm.akae.re](https://ixpm.akae.re/)

## Operations Notes

Currently several friends' networks have connected to Akaere IX, everyone playing BGP together, testing routes, tinkering with RPKI. Bandwidth and scale aren't really the point - the key is being able to interconnect, communicate, and grow together.

### Pitfalls Encountered

- VXLAN occasionally acts up, tunnels unstable, need more monitoring
- Each member's routing policy is different, configuration needs to be flexible

### Technical Gains

- BGP route control and policy tricks - hands-on practice is way more interesting than reading books
- RPKI deployment and exception handling - security level maxed out
- VXLAN cross-regional layer 2 networks - remote access so easy
- Automated script management - saves a lot of worry

## Future Ideas

Akaere IX is still slowly improving, future plans:

- Multiple access points, covering more regions
- Better automation and visualization
- Enrich routing security services more
- Maybe even interconnect with other IXPs for fun

## Summary

This IXP tinkering experience brought not just technical knowledge, but the joy of growing together with a group of friends who also love networking. The essence of the internet is openness and connection - IXP is just a small microcosm of that.

If you also want to play with BGP and experience network interconnection, feel free to reach out (team@akae.re), let's tinker together!

![AKIX Logo](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/akaere/Akaere%20IXP.png)

---

**Technical References:**

- [BIRD Router Documentation](https://bird.network.cz/)
- [RPKI Deployment Guide](https://rpki.readthedocs.io/)
 