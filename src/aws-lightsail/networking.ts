import { CfnInstance } from 'aws-cdk-lib/aws-lightsail';

/**
 * The properties for the Port.
 */
export interface PortProps {
  /**
   * The access direction (inbound or outbound).
   *
   * Lightsail currently supports only inbound access direction.
   *
   * @default - 'inbound'
   */
  readonly accessDirection?: string;

  /**
   * The location from which access is allowed.
   *
   * For example, 'Anywhere (0.0.0.0/0)', or 'Custom' if a specific IP address or range of IP addresses is allowed.
   *
   * @default - 'Anywhere (0.0.0.0/0)'
   */
  readonly accessFrom?: string;

  /**
   * The type of access (Public or Private).
   *
   * @default - 'Public'
   */
  readonly accessType?: string;

  /**
   * An alias that defines access for a preconfigured range of IP addresses.
   *
   * The only alias currently supported is 'lightsail-connect', which allows IP addresses of the browser-based RDP/SSH client in the Lightsail console to connect to your instance.
   */
  readonly cidrListAliases?: string[];

  /**
   * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
   *
   * Examples:
   * - To allow the IP address 192.0.2.44, specify '192.0.2.44' or '192.0.2.44/32'.
   * - To allow the IP addresses 192.0.2.0 to 192.0.2.255, specify '192.0.2.0/24'.
   */
  readonly cidrs?: string[];

  /**
   * The common name of the port information.
   */
  readonly commonName?: string;

  /**
   * The first port in a range of open ports on an instance.
   *
   * Allowed ports:
   * - TCP and UDP - 0 to 65535
   * - ICMP - The ICMP type for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping.
   * - ICMPv6 - The ICMP type for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code).
   */
  readonly fromPort?: number;

  /**
   * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
   *
   * Only devices with an IPv6 address can connect to an instance through IPv6; otherwise, IPv4 should be used.
   */
  readonly ipv6Cidrs?: string[];

  /**
   * The IP protocol name.
   *
   * The name can be one of the following:
   * - 'tcp' - Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of streamed data between applications running on hosts communicating by an IP network.
   * - 'all' - All transport layer protocol types.
   * - 'udp' - With User Datagram Protocol (UDP), computer applications can send messages (or datagrams) to other hosts on an Internet Protocol (IP) network.
   * - 'icmp' - Internet Control Message Protocol (ICMP) is used to send error messages and operational information indicating success or failure when communicating with an instance.
   *
   * @default - 'tcp'
   */
  readonly protocol?: string;

  /**
   * The last port in a range of open ports on an instance.
   *
   * Allowed ports:
   * - TCP and UDP - 0 to 65535
   * - ICMP - The ICMP code for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping.
   * - ICMPv6 - The ICMP code for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code).
   */
  readonly toPort?: number;
}

/**
 * Represents a Port configuration for a Lightsail instance.
 */
export class Port {
  /**
   * Create a Port for HTTP traffic (port 80).
   */
  public static http(): Port {
    return new Port({
      fromPort: 80,
      toPort: 80,
      protocol: 'tcp',
      commonName: 'HTTP',
    });
  }

  /**
   * Create a Port for HTTPS traffic (port 443).
   */
  public static https(): Port {
    return new Port({
      fromPort: 443,
      toPort: 443,
      protocol: 'tcp',
      commonName: 'HTTPS',
    });
  }

  /**
   * Create a Port for SSH traffic (port 22).
   */
  public static ssh(): Port {
    return new Port({
      fromPort: 22,
      toPort: 22,
      protocol: 'tcp',
      commonName: 'SSH',
    });
  }

  /**
   * Create a Port for RDP traffic (port 3389).
   */
  public static rdp(): Port {
    return new Port({
      fromPort: 3389,
      toPort: 3389,
      protocol: 'tcp',
      commonName: 'RDP',
    });
  }

  /**
   * Create a Port for ICMP ping.
   */
  public static icmpPing(): Port {
    return new Port({
      fromPort: 8,
      toPort: -1,
      protocol: 'icmp',
      commonName: 'Ping',
    });
  }

  /**
   * Create a Port for ICMPv6 ping.
   */
  public static icmpv6Ping(): Port {
    return new Port({
      fromPort: 128,
      toPort: 0,
      protocol: 'icmp',
      commonName: 'Ping IPv6',
    });
  }

  /**
   * The access direction (inbound or outbound).
   */
  public readonly accessDirection: string;

  /**
   * The location from which access is allowed.
   */
  public readonly accessFrom: string;

  /**
   * The type of access (Public or Private).
   */
  public readonly accessType: string;

  /**
   * An alias that defines access for a preconfigured range of IP addresses.
   */
  public readonly cidrListAliases?: string[];

  /**
   * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
   */
  public readonly cidrs?: string[];

  /**
   * The common name of the port information.
   */
  public readonly commonName?: string;

  /**
   * The first port in a range of open ports on an instance.
   */
  public readonly fromPort?: number;

  /**
   * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
   */
  public readonly ipv6Cidrs?: string[];

  /**
   * The IP protocol name.
   */
  public readonly protocol: string;

  /**
   * The last port in a range of open ports on an instance.
   */
  public readonly toPort?: number;

  constructor(props: PortProps) {
    this.accessDirection = props.accessDirection ?? 'inbound';
    this.accessFrom = props.accessFrom ?? 'Anywhere (0.0.0.0/0)';
    this.accessType = props.accessType ?? 'Public';
    this.cidrListAliases = props.cidrListAliases ?? [];
    this.cidrs = props.cidrs ?? [];
    this.commonName = props.commonName ?? '';
    this.fromPort = props.fromPort;
    this.ipv6Cidrs = props.ipv6Cidrs ?? [];
    this.protocol = props.protocol ?? 'tcp';
    this.toPort = props.toPort;
  }

  /**
   * Convert this Port to CloudFormation property format.
   */
  public toCloudFormation(): CfnInstance.PortProperty {
    return {
      accessDirection: this.accessDirection,
      accessFrom: this.accessFrom,
      accessType: this.accessType,
      cidrListAliases: this.cidrListAliases,
      cidrs: this.cidrs,
      commonName: this.commonName,
      fromPort: this.fromPort,
      ipv6Cidrs: this.ipv6Cidrs,
      protocol: this.protocol,
      toPort: this.toPort,
    };
  }

  /**
   * Render the Port as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.PortProperty {
    return {
      accessDirection: this.accessDirection,
      accessFrom: this.accessFrom,
      accessType: this.accessType,
      cidrListAliases: this.cidrListAliases,
      cidrs: this.cidrs,
      commonName: this.commonName,
      fromPort: this.fromPort,
      ipv6Cidrs: this.ipv6Cidrs,
      protocol: this.protocol,
      toPort: this.toPort,
    };
  }
}

/**
 * The properties for the MonthlyTransfer.
 */
export interface MonthlyTransferProps {
  /**
   * The amount of allocated monthly data transfer (in GB) for an instance.
   */
  readonly gbPerMonthAllocated?: string;
}

/**
 * Represents the monthly data transfer allocation for a Lightsail instance.
 */
export class MonthlyTransfer {
  /**
   * Create a MonthlyTransfer with 1TB allocation.
   */
  public static oneTb(): MonthlyTransfer {
    return new MonthlyTransfer({
      gbPerMonthAllocated: '1024',
    });
  }

  /**
   * Create a MonthlyTransfer with 2TB allocation.
   */
  public static twoTb(): MonthlyTransfer {
    return new MonthlyTransfer({
      gbPerMonthAllocated: '2048',
    });
  }

  /**
   * Create a MonthlyTransfer with 5TB allocation.
   */
  public static fiveTb(): MonthlyTransfer {
    return new MonthlyTransfer({
      gbPerMonthAllocated: '5120',
    });
  }

  /**
   * The amount of allocated monthly data transfer (in GB) for an instance.
   */
  public readonly gbPerMonthAllocated?: string;

  constructor(props: MonthlyTransferProps) {
    this.gbPerMonthAllocated = props.gbPerMonthAllocated;
  }

  /**
   * Convert this MonthlyTransfer to CloudFormation property format.
   */
  public toCloudFormation(): CfnInstance.MonthlyTransferProperty {
    return {
      gbPerMonthAllocated: this.gbPerMonthAllocated,
    };
  }

  /**
   * Render the MonthlyTransfer as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.MonthlyTransferProperty {
    return {
      gbPerMonthAllocated: this.gbPerMonthAllocated,
    };
  }
}

/**
 * The properties for the Networking.
 */
export interface NetworkingProps {
  /**
   * The monthly amount of data transfer, in GB, allocated for the instance.
   */
  readonly monthlyTransfer?: MonthlyTransfer;

  /**
   * An array of ports to open on the instance.
   */
  readonly ports: Port[];
}

/**
 * Represents the networking configuration for a Lightsail instance.
 *
 * This includes public ports and the monthly amount of data transfer allocated for the instance.
 */
export class Networking {
  /**
   * Create a basic web server networking configuration with HTTP and HTTPS ports.
   */
  public static webServer(): Networking {
    return new Networking({      
      ports: [Port.http(), Port.https()],
    });
  }

  /**
   * Create a basic web server networking configuration with HTTP, HTTPS, and SSH ports.
   */
  public static webServerWithSsh(): Networking {
    return new Networking({      
      ports: [Port.http(), Port.https(), Port.ssh()],
    });
  }

  /**
   * Create a Windows server networking configuration with RDP and HTTP ports.
   */
  public static windowsServer(): Networking {
    return new Networking({      
      ports: [Port.rdp(), Port.http(), Port.https()],
    });
  }

  /**
   * Create a minimal networking configuration with only SSH access.
   */
  public static sshOnly(): Networking {
    return new Networking({      
      ports: [Port.ssh()],
    });
  }

  /**
   * Create a custom networking configuration.
   */
  public static custom(ports: Port[]): Networking {
    return new Networking({      
      ports,
    });
  }

  /**
   * An array of ports to open on the instance.
   */
  public readonly ports: Port[];

  constructor(props: NetworkingProps) {    
    this.ports = props.ports;
  }

  /**
   * Render the Networking as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.NetworkingProperty {
    return {      
      ports: this.ports.map(port => port._render()),
    };
  }
}
