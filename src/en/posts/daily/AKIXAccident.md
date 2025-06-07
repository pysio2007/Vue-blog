---
title: AKIX Incident Compilation
date: 2025-05-26
icon: fa-kit fa-wireshark
category: daily
tag:
  - BGP
  - Daily
---

## 1. Dude, How Is Your Next Hop the Upstream?

[2025/5/15 Original Post](https://pysio.blog/notes/a7u2jlwwrd490031)

After helping AS208754 debug for 2 hours, we discovered his next hop was actually the upstream!

```text
 Why isn't my prefix exported to upstream? Upstream Import 0
 Friend: If nothing works, try "all"
 OK
 Upstream: Import 0
 Friend: That's weird, try xxxx
```

His Bird Config turned out to be:

```conf
protocol static {
    ipv6;
    route <prefix>::/44 via fd00:2::1
}
```

Well, let's explain what happened:

In this BGP session, `fd00:2::1` is the upstream's address, but obviously he statically specified the next hop route as the upstream address, which created a loop. Of course Bird went on strike!

## 2. Massive Withdrawal Updates

[2025/5/22 Original Post](https://pysio.blog/notes/a81vh2qounpi0033) 

Due to BuyVM's problematic LU network, it caused massive withdrawal updates as shown below: 

```bash
    Routes:         1 imported, 213789 exported, 1 preferred
    Route change stats:     received   rejected   filtered    ignored   accepted
      Import updates:           6295          0          0          5       6290
      Import withdraws:            0          0        ---          0       6289
      Export updates:     1340353503      12530      19382        --- 1340321591
      Export withdraws:        16719        ---        ---        ---       9950
```

## 3. DN42 IP McDonald's Random Config

[2025/5/22 Original Post](https://pysio.blog/notes/a8346q5ounpi004y) 

While everyone in the group was helping @Alice_8585@baka.ink figure out why his BGP configuration wasn't correctly exporting IPv4 prefixes, we saw this WireGuard configuration:

```bash
3: pyiso: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet 172.20.44.131 peer 172.20.183.3/32 scope global pyiso
       valid_lft forever preferred_lft forever
    inet6 fe80::440/64 scope link
       valid_lft forever preferred_lft forever
4: lezi: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet 172.20.44.132 peer 172.22.137.99/32 scope global lezi
       valid_lft forever preferred_lft forever
    inet6 fe80::387/64 scope link
       valid_lft forever preferred_lft forever
```

Did everyone notice what went wrong? That's right! He configured different IP addresses for different WireGuard tunnels, which is not allowed in DN42...

::: details Attached is a post from STE

You mean, we can't ping each other, constantly checking birdc, bird.conf, BGP status, almost considering whether the network on your side is being continuously irradiated by cosmic rays causing bit flips and packet explosion, while your WireGuard peer was filled with a random IP?

You mean, the BIRD configuration has a neighbor address written as one IP address, the WireGuard configuration has another, and another interface has yet another, and then you say there's nothing wrong, making us debug like we're solving riddles?

You mean, you turned the WireGuard tunnel into a maze? Making our traceroute feel like exploring unknown universes?

This isn't just a regular tunnel anymore, it's a random address generator. Even if IETF came, they couldn't explain why your BGP won't start.

8585's WireGuard interface, configuration file, and BIRD's neighbor IP configuration used three different IPs, which was the main reason we wasted a lot of time troubleshooting network connectivity issues.

VPN, especially WireGuard, a P2P protocol, has very strict requirements for IP consistency on both sides. It's not like regular Ethernet that relies on broadcast as a fallback. Wrong IP configuration means complete disconnection, and any subsequent optimization is futile.

I suggest that in the future when configuring VPN and BIRD-related interface addresses, paste all detailed information to some website to greatly save troubleshooting costs.

The internet is really fun

:::

## 4. WireGuard Is Sleeping!

[2025/5/23 Original Post](https://pysio.blog/notes/a839ueoounpi005f)

Yes, after we spent half an hour studying why the WireGuard tunnel wasn't working, a casual ping discovered it was actually reachable...

This teaches us not to judge whether there's a handshake by looking at WireGuard's last handshake, because it might very well be slacking off.

Just send any packet and it starts working again. Very magical.

## 5. Dude, Where is your Route6?

Once again, it's AS208754, After discovering that her /48 prefix was unpingable, she came to the group for help.

```text

AS208754: Why can't anyone ping my /48 from China? Is it blocked by the GFW?

Group friend: What heinous thing did you do to get your /48 blocked by the GFW!?

AS208754: WTF

(After a long debugging)

Upstream: Import 0

Upstream: Where's your route6?

```

After explanations from group friends, it turned out that they had only configured rDNS for the /48 prefix that day, but forgot to set up route6. The filter it.

This incident teaches us: Always double-check before configuring anything. Make sure everything is verified before deploying, and never blindly push changes into the production environment.
