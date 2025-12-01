import * as aws_cdk from 'aws-cdk-lib';
import { Resource, IResource, aws_lightsail, Token, IResolvable, Lazy, Names } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  LinuxOSBlueprint,
  WindowsOSBlueprint,
  LinuxAppBlueprint,
  WindowsAppBlueprint,
  BlueprintBase,
} from './blueprints';
import { Bundle } from './bundle';

export interface IInstance extends IResource {
  /**
   * The instance Arn.
   * 
   * @attribute
   */
  readonly instanceArn: string;

  /**
   * The ipv6 addresses.   
   */
  readonly ipv6Addresses: string[];

  /**
   * The is static ip.
   */
  readonly isStaticIp: IResolvable;

  /**
   * The location availability zone.
   */
  readonly locationAvailabilityZone: string;

  /**
   * The location region name.
   */
  readonly locationRegionName: string;

  /**
   * The networking monthly transfer gb per month allocated.
   */
  readonly networkingMonthlyTransferGbPerMonthAllocated: string;

  /**
   * The private ip address.
   */
  readonly privateIpAddress: string;

  /**
   * The public ip address.
   */
  readonly publicIpAddress: string;
}

export interface InstanceProps {
  /**
   * It describes the add-ons for an instance.
   * @default - AutoSnapshot add-on is enabled by default.
   */
  readonly addOns?: AddOn[];

  /**
   * It describes the blueprint for an instance.   
   * The blueprint determines the operating system, software.
   */
  readonly blueprint: LinuxOSBlueprint | WindowsOSBlueprint | LinuxAppBlueprint | WindowsAppBlueprint | BlueprintBase;

  /**
   * It describes the bundle for an instance.
   * The bundle determines the hardware for an instance.
   */
  readonly bundle: Bundle;

  /**
   * It describes the hardware for an instance.
   * The hardware determines the CPU, memory, and storage for an instance.
   */
  readonly hardware?: HardwareProps;

  /**
   * It describes the name of the instance.
   * @default - a unique, lowercased logical name is generated.
   */
  readonly instanceName?: string;

  /**
   * It describes the name of the key pair for an instance.
   * @default - no key pair.
   */
  readonly keyPairName?: string;

  /**
   * It describes the networking for an instance.
   * @default - no networking.
   */
  readonly networking?: Networking;

  /**
   * It describes the user data for an instance.
   * @default - no user data.
   */
  readonly userData?: aws_cdk.aws_ec2.UserData;
}

export class Instance extends Resource implements IInstance {  
  public readonly addOns?: AddOn[];
  public readonly blueprint:
    | LinuxOSBlueprint
    | WindowsOSBlueprint
    | LinuxAppBlueprint
    | WindowsAppBlueprint
    | BlueprintBase;
  public readonly bundle: Bundle;  
  private readonly props: InstanceProps;
  public readonly instanceName?: string;
  public readonly keyPairName?: string;
  public readonly networking?: Networking;
  public readonly userData?: aws_cdk.aws_ec2.UserData;

  public readonly instanceArn: string;
  public readonly ipv6Addresses: string[];
  public readonly isStaticIp: IResolvable;
  public readonly locationAvailabilityZone: string;
  public readonly locationRegionName: string;
  public readonly networkingMonthlyTransferGbPerMonthAllocated: string;
  public readonly privateIpAddress: string;
  public readonly publicIpAddress: string;  

  constructor(scope: Construct, id: string, props: InstanceProps) {
    super(scope, id, {
      physicalName:
        props.instanceName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 64, allowedSpecialCharacters: '-' }).toLowerCase(),
        }),
    });
    
    this.props = props;

    this.addOns = props.addOns ?? [new AddOn({})];
    this.blueprint = props.blueprint;
    this.bundle = props.bundle;    
    this.keyPairName = props.keyPairName ?? undefined;
    this.networking = props.networking ?? new Networking({});
    this.userData = props.userData ?? aws_cdk.aws_ec2.UserData.custom('');

    const instance = this.createResource(this, 'Resource', {
      addOns: this.renderAddOns(this.addOns),
      instanceName: this.props.instanceName ?? this.physicalName,
      keyPairName: this.keyPairName,
      blueprintId: this.blueprint.id,
      bundleId: this.bundle.id,      
      networking: this.renderNetworking(this.networking),
      userData: this.renderUserData(this.userData),
    });
    
    this.instanceArn = instance.attrInstanceArn;
    this.instanceName = instance.instanceName;
    this.networkingMonthlyTransferGbPerMonthAllocated = instance.attrNetworkingMonthlyTransferGbPerMonthAllocated;
    this.privateIpAddress = instance.attrPrivateIpAddress;
    this.publicIpAddress = instance.attrPublicIpAddress;
    this.ipv6Addresses = instance.attrIpv6Addresses;
    this.isStaticIp = instance.attrIsStaticIp;
    this.locationAvailabilityZone = instance.attrLocationAvailabilityZone;
    this.locationRegionName = instance.attrLocationRegionName;
  }

  protected createResource(
    scope: Construct,
    id: string,
    props: aws_lightsail.CfnInstanceProps,
  ): aws_lightsail.CfnInstance {    
    return new aws_lightsail.CfnInstance(scope, id, props);
  }

  /**
   * Render addOns property.
   *
   * @internal
   */
  private renderAddOns(props: AddOn[]): any[] | undefined {
    return props.map(addon => addon._render());
  }

  /**
   * Render networking property.
   *
   * @internal
   */
  private renderNetworking(props: Networking): any | undefined {
    return props._render();    
  }

  /**
   * Render user data property.
   *
   * @internal
   */
  private renderUserData(props: aws_cdk.aws_ec2.UserData): string {
    return props.render();
  }
}

export interface AutoSnapshotAddOnProps {
  /**
   * @default - "06:00"
   */
  readonly snapshotTimeOfDay?: string;
}

export class AutoSnapshotAddOn {
  public readonly snapshotTimeOfDay: string;

  constructor(props: AutoSnapshotAddOnProps) {
    const snapshotTimeOfDay = props.snapshotTimeOfDay ?? '06:00';
    this.validate(snapshotTimeOfDay);

    this.snapshotTimeOfDay = snapshotTimeOfDay;
  }

  /**
   * @internal
   */
  public _render(): aws_lightsail.CfnInstance.AutoSnapshotAddOnProperty {
    return {
      snapshotTimeOfDay: this.snapshotTimeOfDay,
    };
  }

  private validate(snapshotTimeOfDay: string): void {
    const validSnapshotTimeOfDay = snapshotTimeOfDay !== undefined && !Token.isUnresolved(snapshotTimeOfDay);

    const pattern = /^[0-9]{2}:00$/;
    if (validSnapshotTimeOfDay && !pattern.test(snapshotTimeOfDay)) {
      throw new Error(
        `snapshotTimeOfDay must be in the format "HH:00" (24-hour, UTC), e.g. "06:00" or "18:00". Got: "${snapshotTimeOfDay}".`,
      );
    }

    const hour = parseInt(snapshotTimeOfDay.substring(0, 2), 10);
    if (validSnapshotTimeOfDay && (isNaN(hour) || hour < 0 || hour > 23)) {
      throw new Error(`snapshotTimeOfDay hour component must be between 00 and 23. Got: "${snapshotTimeOfDay}".`);
    }
  }
}

export interface AddOnProps {
  /**
   * @default - "AutoSnapshot"
   */
  readonly addOnType?: string;
  readonly autoSnapshotAddOnRequest?: AutoSnapshotAddOn;
  readonly status?: 'Enabled' | 'Disabled';
}

export class AddOn {
  public static autoSnapshot(props: AutoSnapshotAddOnProps = {}): AddOn {
    return new AddOn({
      addOnType: 'AutoSnapshot',
      autoSnapshotAddOnRequest: new AutoSnapshotAddOn(props),
      status: 'Enabled',
    });
  }

  public readonly addOnType: string;
  public readonly autoSnapshotAddOnRequest?: AutoSnapshotAddOn;
  public readonly status: 'Enabled' | 'Disabled';

  constructor(props: AddOnProps) {
    this.addOnType = props.addOnType ?? 'AutoSnapshot';
    this.autoSnapshotAddOnRequest = props.autoSnapshotAddOnRequest;
    this.status = props.status ?? 'Enabled';
  }

  public _render(): aws_lightsail.CfnInstance.AddOnProperty {
    return {
      addOnType: this.addOnType,
      autoSnapshotAddOnRequest: this.autoSnapshotAddOnRequest?._render(),
      status: this.status,
    };
  }
}

export interface HardwareProps {
  readonly cpuCount?: number;
  readonly disks?: aws_lightsail.CfnDisk[]
  readonly ramSizeInGb?: number;
}
export interface PortProps {
  readonly accessDirection?: string;
  readonly accessFrom?: string;
  readonly accessType?: string;
  readonly cidrListAliases?: string[];
  readonly cidrs?: string[];
  readonly commonName?: string;
  readonly fromPort?: number;
  readonly ipv6Cidrs?: string[];
  readonly protocol?: string;
  readonly toPort?: number;
}

export class Port {
  public static http(): Port {
    return new Port({
      fromPort: 80,
      toPort: 80,
      protocol: 'tcp',
      commonName: 'HTTP',
    });
  }

  public static https(): Port {
    return new Port({
      fromPort: 443,
      toPort: 443,
      protocol: 'tcp',
      commonName: 'HTTPS',
    });
  }

  public static ssh(): Port {
    return new Port({
      fromPort: 22,
      toPort: 22,
      protocol: 'tcp',
      commonName: 'SSH',
    });
  }

  public readonly accessDirection: string;
  public readonly accessFrom: string;
  public readonly accessType: string;
  public readonly cidrListAliases?: string[];
  public readonly cidrs?: string[];
  public readonly commonName?: string;
  public readonly fromPort?: number;
  public readonly ipv6Cidrs?: string[];
  public readonly protocol: string;
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

  public _render(): aws_lightsail.CfnInstance.PortProperty {
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

export interface MonthlyTransferProps {
  readonly gbPerMonthAllocated?: string;
}

export interface NetworkingProps {
  readonly ports?: Port[];
  readonly monthlyTransfer?: MonthlyTransferProps;
}

export class Networking {
  public static webServer(): Networking {
    return new Networking({
      ports: [Port.http(), Port.https()],
    });
  }

  public static webServerWithSsh(): Networking {
    return new Networking({
      ports: [Port.http(), Port.https(), Port.ssh()],
    });
  }

  public static sshOnly(): Networking {
    return new Networking({
      ports: [Port.ssh()],
    });
  }

  public static custom(ports: Port[]): Networking {
    return new Networking({
      ports,
    });
  }

  public readonly ports?: Port[];  

  constructor(props: NetworkingProps) {
    this.ports = props.ports ?? [];    
  }

  public _render(): any | undefined {
    return {
      ports: (this.ports ?? []).map(port => port._render()),
    };
  }
}
