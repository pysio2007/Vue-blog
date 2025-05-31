---
title: Setting up AnyCast + Blog
date: 2025-02-15
icon: fa-solid fa-router
category: daily
tag:
  - BGP
  - Daily
---

Since I had nothing to do, I decided to set up an Anycast and put my blog and DNS on it. This article documents the process of setting up Anycast + blog.

## What is Anycast?

> Anycast is a network addressing and routing method that can route incoming requests to various different locations or "nodes". In the context of CDN, Anycast usually routes incoming traffic to the nearest data center that can effectively handle requests. Selective routing enables Anycast networks to handle high traffic, network congestion, and DDoS attacks.[^1]

## Prerequisites

- An ASN
- An IPv4/6 address segment 
- Multiple servers capable of BGP Session (preferably using multiple upstreams)
- A smart brain
- ~~Of course, also a cup of coffee~~

## 1. Finding an Upstream

Major carriers often have access points in hosting centers. You can purchase hosting services from the data center, then directly contact carriers to sign contracts for bandwidth and IP transit services. But given domestic characteristics, this whole process will only get you an astronomical bill ~~(unless you're not short on money, then pretend I didn't say anything)~~

But the good news is, many VPS providers offer BGP Session services, such as Vultr, BuyVM, etc. You can choose one of them as your upstream. These providers charge about $5-10 per month, which is reasonably cost-effective.

You can also find more providers here: [BGP Services](https://bgp.services/)

## 2. Announcing Addresses

Before starting this step, you should verify your ASN and IP address segment according to the provider's requirements. Most providers require opening a ticket. This article uses Vultr/BuyVM as examples.

### Getting Connection Information

#### Vultr

~~Since I forgot to take screenshots during configuration, I'll briefly cover the Vultr ASN/IP segment registration part QWQ~~

Open this address: [Vultr BGP](https://my.vultr.com/bgp/) Fill in your ASN and IP address segment. Vultr will send a verification code email to your Whois email. After verification, wait for Vultr staff to review (remember to reply to tickets).

After approval, open VPS details, click the `BGP` tab to get the following information:

![Vultr BGP](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20250216154622.png)

Now you have the information to establish BGP Session with Vultr.

#### BuyVM

Login to [BuyVM management panel](https://manage.buyvm.net/) Select your machine, click `Networking` -> `BGP`. After submitting a ticket, wait for approval to get the following information:

![BuyVM BGP](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20250217081432.png)

Now you have the information to establish BGP Session with BuyVM.

### Configuring Bird2

I use `Debian 12` as an example, directly install Bird2 using APT: `apt install bird2`

My ASN is `AS213605` and I want to announce `2a14:67c1:a020::/48`

Using Vultr as an example, they give peer ASN `64515`, peer IP `2001:19f0:ffff::1`, our VPS's own IPv6 address is `2001:19f0:5001:225f:5400:05ff:fe69:6776`, MD5 password is 114514, so my configuration file is:

```conf
log syslog all;

router id 114.514.111.222; # VPS public IPv4 address
define ASN=213605; # Your ASN
define OWNIPv6s=[2a14:67c1:a020::/48]; # Your IPv6 address segment

# device protocol is required, otherwise BIRD won't automatically get network interface info from kernel
protocol device {}

# kernel protocol exports routing table to kernel
protocol kernel {
    ipv6 {
        export all; # Import all IPv6 routes to system routing table
    };
}

# static defines static routes
protocol static static_v6 {
    ipv6;
    route 2a14:67c1:a020::/48 via 2001:19f0:5001:225f:5400:05ff:fe69:6776;  # Announce 2a14:7c0:4d00::/40 segment, modify the IP after via to your VPS's IPv6
}

filter export_filter_v6 {
    if net ~ OWNIPv6s then accept; # If prefix is included in OWNIPv6s then allow
    reject; # Otherwise reject all
}

filter import_filter_v6 {
    if net ~ [::/0] then reject; # If default route then reject
    accept; # Accept all other routes
}

protocol bgp vultr {
    local as ASN; # Specify local ASN
    source address 2001:19f0:5001:225f:5400:05ff:fe49:6493; # Specify local address
    multihop 2; # Set multihop, Vultr provides value 2
    neighbor 2001:19f0:ffff::1 as 64515; # Specify peer address and ASN
    ipv6 { # Specify protocol to run on this BGP neighbor
        import filter import_filter_v6; # Specify import filter
        export filter export_filter_v6; # Specify export filter
        export limit 10; # Limit export prefix count, adjust as needed, prevent session explosion from misconfigured filters
    };
    password "114514"; # If no password, delete this line
    graceful restart; # Graceful restart, prevent service interruption from route withdrawal when restarting bird
}
```

You can modify based on my configuration file (recommend reading soha's tutorial first then writing by hand[^2]), write to `/etc/bird/bird.conf`, then apply configuration `birdc c`

You can run `birdc show protocols all` to view current status of all protocols:

```shell
vultr    BGP        ---        up     2025-02-10    Established   
  BGP state:          Established
    Neighbor address: 2001:19f0:ffff::1
    Neighbor AS:      64515
    Local AS:         213605
    Neighbor ID:      45.76.40.105
    Local capabilities
      Multiprotocol
        AF announced: ipv6
      Route refresh
      Graceful restart
        Restart time: 120
        AF supported: ipv6
        AF preserved:
      4-octet AS numbers
      Enhanced refresh
      Long-lived graceful restart
    Neighbor capabilities
      Multiprotocol
        AF announced: ipv6
      Route refresh
      Extended message
      Graceful restart
      4-octet AS numbers
      ADD-PATH
        RX: ipv6
        TX:
      Enhanced refresh
      Long-lived graceful restart
        LL stale time: 0
        AF supported:
        AF preserved: ipv6
      Hostname: ams510.vultr.com
    Session:          external multihop AS4
    Source address:   2001:19f0:5001:225f:5400:5ff:fe49:6493
    Hold timer:       142.836/180
    Keepalive timer:  38.528/60
  Channel ipv6
    State:          UP
    Table:          master6
    Preference:     100
    Input filter:   ACCEPT
    Output filter:  ACCEPT
    Routes:         203065 imported, 2 exported, 203065 preferred
    Route change stats:     received   rejected   filtered    ignored   accepted
      Import updates:        8010300          0          0     204161    7806139
      Import withdraws:      4736940          0        ---        194    4736746
      Export updates:        7806141    7806139          0        ---          2
      Export withdraws:      4736746        ---        ---        ---          0
    BGP Next hop:   2001:19f0:5001:225f:5400:5ff:fe49:6493
    IGP IPv6 table: master6
```

Announced IP segments need some time for global propagation and convergence. You can do something else, or just sleep (if you're configuring at midnight).

After waiting 30 minutes to an hour, you can open [BGP Tools](https://bgp.tools/) and enter your IP segment to check global propagation status.

![My Anycast Propagation Status](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20250217083854.png)

## 3. Network Interface Configuration

Now we've successfully announced `2a14:67c1:a020::/48`.

Global traffic accessing `2a14:67c1:a020::/48` is now routed to our VPS, but our VPS is currently configured to do nothing and directly return unreachable. We just need to do some small configuration on the VPS to provide global services:

```bash
# Create a dummy network interface
ip link add dev dummy0 type dummy
ip link set dummy0 up

# Choose a favorite IP address and configure it
ip addr add dev dummy0 2a14:67c1:a020::1
```

After completion, we can ping `2a14:67c1:a020::1` from our computer.

## 4. Anycast?

Now you can follow the above steps to configure BGP Session on multiple servers, then configure network interfaces on each server with the same IP address to achieve Anycast. (Yes, it's that simple)

This way, your access will directly find the nearest server to provide services, but for mainland China, it might very well go around the earth...

Of course, if you have money, you can find carriers (or Alibaba/Tencent) for BGP IP access.

## Reference Articles 

[^1]: [What is an Anycast network? | How Anycast works | Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/)

[^2]: [BIRD and BGP Beginner's Guide](https://soha.moe/post/bird-bgp-kickstart.html)

[Running ISP at Home Part.2 - Announcing IP Segments to the World (BGP Session & BIRD)](https://blog.lyc8503.net/post/asn-2-bgp-session/)

[Running ISP at Home Part.4 - Building Your Own Anycast Network](https://blog.lyc8503.net/post/asn-4-anycast-network/) 