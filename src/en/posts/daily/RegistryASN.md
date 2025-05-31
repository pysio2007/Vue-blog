---
title: ASN Registration and IP Broadcasting from Zero
date: 2025-04-14
icon: fa-light fa-earth-asia
category: daily
tag:
  - BGP
  - Daily
---

> [!warning]
> This article introduces the registration process for real internet ASNs. For DN42 experimental network ASN application processes, please refer to [DN42 ASN Application](https://lantian.pub/article/modify-website/dn42-experimental-network-2020.lantian/).

> [!warning]
> If you are a beginner, I recommend going to DN42 to apply for an experimental network ASN for learning. This article is to help you apply for an ASN in the real internet and broadcast IP addresses.

## 1. Basic Concepts
> RIR: Regional Internet Registry

ASN numbers and IP address resource allocation follows strict international management mechanisms. Global internet resources are managed by five Regional Internet Registries (RIRs):
- [AFRINIC](https://afrinic.net/): Responsible for Africa
- [ARIN](https://www.arin.net/): Responsible for North America
- [LACNIC](https://www.lacnic.net/): Responsible for Latin America and Caribbean
- [RIPE NCC](https://www.ripe.net/): Responsible for Europe, Middle East and Central Asia
- [APNIC](http://apnic.net/): Responsible for Asia Pacific

> LIR: Local Internet Registry

Note that RIRs do not provide services directly to end users, but allocate resources through Local Internet Registries (LIRs). LIRs, as RIR member organizations, need to pay corresponding annual membership fees to maintain their membership status, which is usually not economical for individual users.

When choosing an RIR, RIPE NCC is widely recommended based on three considerations:

1. Cost effectiveness: RIPE NCC's registration fees are relatively reasonable. In comparison, APNIC's basic fees are about 30% higher with additional administrative costs.
2. System convenience: RIPE NCC provides comprehensive online management systems where users can independently complete progress queries, configuration modifications, etc. APNIC's processes still rely on email communication, making it relatively inefficient.
3. Policy stability: RIPE NCC's policy adjustments are moderate and predictable, which has obvious advantages compared to other regional organizations.

In summary, based on available data analysis, RIPE NCC is an ideal choice for individual ASN applications, followed by APNIC or ARIN.

## 2. Preparing Materials
When applying for an ASN, you need to provide the following necessary documents to the LIR (using RIPE NCC registration as an example):

### Identity Documents
- Corporate applicants: Valid business license or company registration certificate
- Individual applicants: Government-issued valid identity documents

Note: If the applicant is a minor, written consent from legal guardians is usually required along with fulfilling guardianship responsibilities. All submitted documents should be authentic and valid, and must be originals or notarized copies.

### Contact Information
- Physical mailing address (for WHOIS database registration)
- Technical operations contact email (NOC Email)
- Abuse report contact email (Abuse Email)

### Technical Requirements Proof
- Valid bills or contracts from BGP service providers within the European region from the last two months
- At least two confirmed BGP upstream providers

### RIPE DB Account and Object Creation

#### 1. Register RIPE NCC Access Account

Open the [RIPE DataBase](https://access.ripe.net/registration) registration page and complete registration. No need to elaborate.

#### 2. Create Initial role and maintainer (mntner) Objects

Open [RIPE DB Create Role And MNT](https://apps.db.ripe.net/db-web-ui/webupdates/create/RIPE/role/self)

A role object is an abstraction of a role performed by one or more people, for example, representing the department you use to handle network incidents.

A maintainer object is an abstraction of a maintainer, recording maintainer authentication information. Other objects authorize who maintains them through the mnt-by attribute.

When creating role and maintainer objects through the above link, you need to fill in:

- ` mntner `: maintainer object identifier, can include uppercase/lowercase letters, numbers and _-, e.g.: YOURNOC-MNT
- ` role `: role object name, can include uppercase/lowercase letters, numbers and ` ][)(._"*@,&:!'+/- ` e.g.: YOURCOMPANY NOC
- ` address `: office address for this role
- ` e-mail `: email contact address for this role

![Example filled information using Akaere NetWork](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Create%20role%20and%20maintainer%20pair.png)

After filling in, click the SUBMIT button to simultaneously create a role and mntner object.

The red box part in the image is the primary key of the role object. You need to submit this as your AS's admin-c / tech-c / abuse-c to your LIR.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Create%20role%20and%20maintainer%20pair%20done.png)

#### 3. Set Abuse Notification Email

> [!caution]
> RIPE NCC will check the validity of this email, make sure it's real and usable

In the search box at the top of [RIPE DB Query](https://apps.db.ripe.net/db-web-ui/query), enter the primary key of the role object from the previous section and click the search button. Then click the Update object button in the upper right corner of the search results to jump to the modification page.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Edit%20Abuse.png)

Click the + button to the right of the e-mail field to add an abuse-mailbox attribute to this role object.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Edit%20Abuse%202.png)

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Edit%20Abuse%203.png)

Fill in the abuse notification email in the appearing abuse-mailbox field and click SUBMIT to save.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Edit%20Abuse%204.png)

#### 4. Create organisation Object

An organisation object is an abstraction of a company, non-profit group, or individual. All other resources are related to this object. It's the starting point for managing data in the RIPE database.

When creating an organisation object through [RIPE DB Create Organisation](https://apps.db.ripe.net/db-web-ui/webupdates/create/RIPE/organisation), you need to fill in:

- ` mnt-by`: who manages this, automatically filled with the previously created mntner identifier
- ` organisation`: organisation object identifier, default AUTO-1 will be automatically generated by the system
- ` org-name `: organisation name, must be the legal full name of the organization or individual name
- ` address`: organisation contact address, must be the legal address of the organization or individual residence
- ` e-mail `: organisation email contact address
- ` abuse-c `: organisation abuse notification contact, must point to a role object with abuse-mailbox attribute
- ` mnt-ref `: who can reference this organisation, the pointed mntner can add objects pointing to this organisation, i.e., who allocates resources for this organization, ask your LIR for the specific value

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Creat%20organisation.png)

After filling in, click SUBMIT. The page will show the organisation object identifier with "ORG-EXAMPLE-RIPE" (red box part in the image). You need to submit this as your AS's org to your LIR.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/Creat%20organisation%20Done.png)

#### 4.1 How to Modify if Something Went Wrong?

When you discover errors in the above content, go to [RIPE DB Query](https://apps.db.ripe.net/db-web-ui/query), search for the primary key of the object you need to correct, and click the Update object button in the upper right corner to jump to the modification page.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/RIPEUPDATE1.png)

After entering the modification page, correct the content you need to modify and click SUBMIT to submit.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/RIPEUPDATE2.png)

After completion, the RIPE database will show that you've modified the content. This ends the modification process.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/RIPEUPDATE3.png)

#### 5. Submit Materials

You need to provide the following materials to the LIR:

- Company registration certificate / Passport (front and back of Chinese resident ID card)
- Proof of network activity within RIPE NCC service area (e.g., European VPS bills)
- AS active region (country)
- as-name (AS name, e.g., CHINATELECOM-CORE-WAN-CN2)
- org (Section 4, organisation object identifier)
- admin-c (Section 2, role object primary key)
- tech-c (Section 2, role object primary key)
- abuse-c (Section 2, role object primary key)
- mnt-by (Section 2, mntner object identifier)

## 3. PeeringDB Creation/Maintenance

### 1. What is PeeringDB?

PeeringDB is like the "social business card holder" of the internet world! Imagine if every network operator was a guest at a party, PeeringDB would be the roster helping everyone get to know each other. Here, you can:

- Tell others "who I am" (your network information)
- Say "where I live" (your network facility locations)
- Leave "contact information" (technical contact information)
- Show "willingness to make friends" (peering policies)

Simply put, PeeringDB is a global database platform helping network operators, data centers, and Internet Exchange Points (IXPs) discover each other and establish connections. It's like the LinkedIn of the networking world, making it easier for everyone to find suitable network partners!

**Summary:** PeeringDB is an important platform for network operators to share network information and establish peering relationships, an almost essential registration database for ASN holders.

### 2. Create PeeringDB Account

Go to [PeeringDB Register](https://www.peeringdb.com/register) to register an account. No need to elaborate.

**Note:** When registering for PeeringDB, it's best to use the email from the role object you created in RIPE DB.

### 3. Link Your ASN in PeeringDB

Go to the Associated Organizations section in [PeeringDB Profile](https://www.peeringdb.com/profile), enter your ASN and organization name to associate.

![Using my own ASN as example](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/preeingdb%20link.png)

After successful association, you can find your organization in the dropdown menu in the upper right corner.

![Following the above image](http://s3.pysio.online/pysioimages/peeringdblinkdone.png)

### 4. Correct Information

In the above image, after clicking into your organization, click the Edit button in the upper right corner to enter the editing interface and supplement some information:

The largest input box in the upper left corner is for organization name, refer to org-name in the RIPE database

Alias (optional): Other names/abbreviations of the organization

Long name (optional): Full name of the organization

Address line 1 (optional): Organization address

Address line 2 (optional): Organization address

Company Website Override: Organization website address

Suite (optional): Organization room number

Location (optional): Specific location

Country and region code: Country and region code where the organization is located

![Example of 13335](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/peeringdborg.png)

### 5. Add Network

Name: Network name

Website: Network website address

IRR as-set/route-set object: Network's IRR as-set/route-set object (though this is stating the obvious)

Network Types (optional): Network type

Traffic level: Incoming/outgoing rates

Traffic ratio: Incoming/outgoing traffic ratio

Geographic scope: Network's geographic scope

Unicast IPv4 / Multicast / IPv6: Check according to actual situation

Policy URL: Peering policy URL

General policy: Peering policy status

Contract requirement: Whether peering requires contracts

Health Check: Network status check

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/peeringdb%20add%20networks.png)

Finally, click submit network to complete.

> Since PeeringDB's interface has too many explanations... I'll skip the IX part for now

## 4. Now You Can Finally Start Broadcasting Your IP!

### 1. Find an Upstream

Major carriers often have access points in hosting facilities. You can purchase hosting services, then directly contact carriers to sign contracts for bandwidth and IP transit services. But given domestic characteristics, this whole process will only get you an astronomical bill ~~(unless you're not short on money, then pretend I didn't say anything)~~

But the good news is, many VPS providers offer BGP Session services, such as Vultr, BuyVM, etc. You can choose one as your upstream. These providers charge about $5-10 per month, which is reasonably cost-effective.

You can also find more providers here: [BGP Services](https://bgp.services/)

### 2. Start Announcing Your IP Address to the World

Before starting this step, you should verify your ASN and IP address segment according to the provider's requirements. Most providers require opening a ticket. This article uses Vultr as an example.

#### 1. Get Connection Information

Open this address: [Vultr BGP](https://my.vultr.com/bgp/) Fill in your ASN and IP address segment. Vultr will send a verification code email to your Whois email. After verification, wait for Vultr staff review (remember to reply to tickets).

After approval, open VPS details, click the `BGP` tab to get the following information:

![Vultr BGP](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20250216154622.png)

Now you have the information to establish BGP Session with Vultr.

#### 2. Configure Bird2

I use `Debian 12` as an example, directly install Bird2 using APT: `apt install bird2`

My ASN is `AS213605` and I want to announce `2a14:67c1:a020::/48`

Using Vultr as example, they give peer ASN `64515`, peer IP `2001:19f0:ffff::1`, our VPS's IPv6 address is `2001:19f0:5001:225f:5400:05ff:fe69:6776`, MD5 password is 114514, so my configuration file is:

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

You can modify based on my configuration file (recommend reading [soha's tutorial](https://soha.moe/post/bird-bgp-kickstart.html) first then writing by hand), write to `/etc/bird/bird.conf`, then apply configuration `birdc c`

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

Announced IP segments need time for global propagation and convergence. You can do something else, or just sleep (if you're configuring at midnight).

After waiting 30 minutes to an hour, you can open [BGP Tools](https://bgp.tools/) and enter your IP segment to check global propagation status.

![Propagation Complete!](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/bgptools.png)

#### 3. Configure Network Interface

Now we've successfully announced `2a14:67c1:a020::/48`.

Global traffic accessing `2a14:67c1:a020::/48` is now routed to our VPS, but our VPS is currently configured to do nothing and return unreachable. We just need some small configuration on the VPS to provide global services:

```bash
# Create a dummy network interface
ip link add dev dummy0 type dummy
ip link set dummy0 up

# Choose a favorite IP address and configure it
ip addr add dev dummy0 2a14:67c1:a020::1
```

After completion, we can ping `2a14:67c1:a020::1` from our computer.

## 5. Some By-products

### 1. ip6.arpa

#### 1. What is ip6.arpa

ip6.arpa is the reverse DNS zone for IPv6. You can add PTR records to make your IP addresses reverse resolvable.

#### 2. How to Create ip6.arpa in RIPE Database and Host on CloudFlare

Open [RIPE Create Domain interface](https://apps.db.ripe.net/db-web-ui/webupdates/wizard/RIPE/domain)

Enter the IP segment you need to create rDNS for, e.g., `2a14:67c1:b103::/48`

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/ripenons.png)

You can see that RIPE now requires you to fill in 2 NS Servers. Let's write two fake ones first.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/ipv6fack.png)

Now you can see RIPE has given the ` Reverse zones ` value as `4.0.1.b.1.c.7.6.4.1.a.2.ip6.arpa.`

Now take this value to CloudFlare to add the domain, then change the fake NS Servers we filled earlier to CloudFlare's NS Servers.

Also, fill admin-c / tech-c / zone-c with the primary key of the role object you created in the RIPE database (yes, the one you submitted to the LIR earlier).

Finally, as shown below, you can click submit.

![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/domaindone.png)

After submission, wait a moment and the domain in CloudFlare will be activated.

## 6. Conclusion

Now your IP segment is publicly reachable. Next you can find more upstreams to play with Anycast? Or drag this IP segment to North Korea/Antarctica to achieve global coverage (tutorials might be coming).

## 7. References

[ASN Application Quick Guide - RIPE NCC](https://lir.zhnet.co.uk/asn-setup-zhcn)

[Young People's First ISP: Registering an ASN](https://blog.liuzhen932.top/posts/asn-1-registration/)

[Running ISP at Home Part.1 - Registering an ASN](https://blog.lyc8503.net/post/asn-1-asn-registration/) 