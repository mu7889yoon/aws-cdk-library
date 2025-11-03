/**
 * Bundle for Lightsail virtual servers
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export class Bundle {
  /**
   * 2vCPUs, 0.5 GB Memory, Dual-Stack
   */
  public static readonly NANO_3_0 = Bundle.of('nano_3_0');

  /**
   * 2vCPUs, 1.0 GB Memory, Dual-Stack
   */
  public static readonly MICRO_3_0 = Bundle.of('micro_3_0');

  /**
   * 2vCPUs, 2.0 GB Memory, Dual-Stack
   */
  public static readonly SMALL_3_0 = Bundle.of('small_3_0');

  /**
   * 2vCPUs, 4.0 GB Memory, Dual-Stack
   */
  public static readonly MEDIUM_3_0 = Bundle.of('medium_3_0');

  /**
   * 2vCPUs, 8.0 GB Memory, Dual-Stack
   */
  public static readonly LARGE_3_0 = Bundle.of('large_3_0');

  /**
   * 4vCPUs, 16.0 GB Memory, Dual-Stack
   */
  public static readonly XLARGE_3_0 = Bundle.of('xlarge_3_0');

  /**
   * 8vCPUs, 32.0 GB Memory, Dual-Stack
   */
  public static readonly X2LARGE_3_0 = Bundle.of('2xlarge_3_0');

  /**
   * 16vCPUs, 64.0 GB Memory, Dual-Stack
   */
  public static readonly X4LARGE_3_0 = Bundle.of('4xlarge_3_0');

  /**
   * 2vCPUs, 0.5 GB Memory, Dual-Stack
   */
  public static readonly NANO_WIN_3_0 = Bundle.of('nano_win_3_0');

  /**
   * 2vCPUs, 1.0 GB Memory, Dual-Stack
   */
  public static readonly MICRO_WIN_3_0 = Bundle.of('micro_win_3_0');

  /**
   * 2vCPUs, 2.0 GB Memory, Dual-Stack
   */
  public static readonly SMALL_WIN_3_0 = Bundle.of('small_win_3_0');

  /**
   * 2vCPUs, 4.0 GB Memory, Dual-Stack
   */
  public static readonly MEDIUM_WIN_3_0 = Bundle.of('medium_win_3_0');

  /**
   * 2vCPUs, 8.0 GB Memory, Dual-Stack
   */
  public static readonly LARGE_WIN_3_0 = Bundle.of('large_win_3_0');

  /**
   * 4vCPUs, 16.0 GB Memory, Dual-Stack
   */
  public static readonly XLARGE_WIN_3_0 = Bundle.of('xlarge_win_3_0');

  /**
   * 8vCPUs, 32.0 GB Memory, Dual-Stack
   */
  public static readonly X2LARGE_WIN_3_0 = Bundle.of('2xlarge_win_3_0');

  /**
   * 16vCPUs, 64.0 GB Memory, Dual-Stack
   */
  public static readonly X4LARGE_WIN_3_0 = Bundle.of('4xlarge_win_3_0');

  /**
   * 2vCPUs, 0.5 GB Memory, IPv6-only
   */
  public static readonly NANO_IPV6_3_0 = Bundle.of('nano_ipv6_3_0');

  /**
   * 2vCPUs, 1.0 GB Memory, IPv6-only
   */
  public static readonly MICRO_IPV6_3_0 = Bundle.of('micro_ipv6_3_0');

  /**
   * 2vCPUs, 2.0 GB Memory, IPv6-only
   */
  public static readonly SMALL_IPV6_3_0 = Bundle.of('small_ipv6_3_0');

  /**
   * 2vCPUs, 4.0 GB Memory, IPv6-only
   */
  public static readonly MEDIUM_IPV6_3_0 = Bundle.of('medium_ipv6_3_0');

  /**
   * 2vCPUs, 8.0 GB Memory, IPv6-only
   */
  public static readonly LARGE_IPV6_3_0 = Bundle.of('large_ipv6_3_0');

  /**
   * 4vCPUs, 16.0 GB Memory, IPv6-only
   */
  public static readonly XLARGE_IPV6_3_0 = Bundle.of('xlarge_ipv6_3_0');

  /**
   * 8vCPUs, 32.0 GB Memory, IPv6-only
   */
  public static readonly X2LARGE_IPV6_3_0 = Bundle.of('2xlarge_ipv6_3_0');

  /**
   * 16vCPUs, 64.0 GB Memory, IPv6-only
   */
  public static readonly X4LARGE_IPV6_3_0 = Bundle.of('4xlarge_ipv6_3_0');

  /**
   * 2vCPUs, 0.5 GB Memory, IPv6-only
   */
  public static readonly NANO_WIN_IPV6_3_0 = Bundle.of('nano_win_ipv6_3_0');

  /**
   * 2vCPUs, 1.0 GB Memory, IPv6-only
   */
  public static readonly MICRO_WIN_IPV6_3_0 = Bundle.of('micro_win_ipv6_3_0');

  /**
   * 2vCPUs, 2.0 GB Memory, IPv6-only
   */
  public static readonly SMALL_WIN_IPV6_3_0 = Bundle.of('small_win_ipv6_3_0');

  /**
   * 2vCPUs, 4.0 GB Memory, IPv6-only
   */
  public static readonly MEDIUM_WIN_IPV6_3_0 = Bundle.of('medium_win_ipv6_3_0');

  /**
   * 2vCPUs, 8.0 GB Memory, IPv6-only
   */
  public static readonly LARGE_WIN_IPV6_3_0 = Bundle.of('large_win_ipv6_3_0');

  /**
   * 4vCPUs, 16.0 GB Memory, IPv6-only
   */
  public static readonly XLARGE_WIN_IPV6_3_0 = Bundle.of('xlarge_win_ipv6_3_0');

  /**
   * 8vCPUs, 32.0 GB Memory, IPv6-only
   */
  public static readonly X2LARGE_WIN_IPV6_3_0 = Bundle.of('2xlarge_win_ipv6_3_0');

  /**
   * 16vCPUs, 64.0 GB Memory, IPv6-only
   */
  public static readonly X4LARGE_WIN_IPV6_3_0 = Bundle.of('4xlarge_win_ipv6_3_0');

  /**
   * custom bundle
   *
   * @param id the bundle id
   */
  public static of(id: string) {
    return new Bundle(id);
  }

  /**
   * @param id the bundle id
   */
  private constructor(public readonly id: string) {}
}
