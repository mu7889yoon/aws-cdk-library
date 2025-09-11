import { CfnInstance } from 'aws-cdk-lib/aws-lightsail';

/**
 * The properties for the Disk.
 */
export interface DiskProps {
  /**
   * The resources to which the disk is attached.
   */
  readonly attachedTo?: string;

  /**
   * (Deprecated) The attachment state of the disk.
   *
   * @deprecated
   * In releases prior to November 14, 2017, this parameter returned `attached` for system disks in the API response.
   * It is now deprecated, but still included in the response. Use `isAttached` instead.
   */
  readonly attachmentState?: string;

  /**
   * The unique name of the disk.
   */
  readonly diskName: string;

  /**
   * The input/output operations per second (IOPS) of the disk.
   */
  readonly iops?: number;

  /**
   * A Boolean value indicating whether this disk is a system disk (has an operating system loaded on it).
   *
   * @default - false
   */
  readonly isSystemDisk?: boolean;

  /**
   * The disk path.
   */
  readonly path: string;

  /**
   * The size of the disk in GB.
   */
  readonly sizeInGb?: string;
}

/**
 * Represents a disk attached to an instance.
 */
export class Disk {
  /**
   * Create a system disk.
   */
  public static systemDisk(diskName: string, path: string, sizeInGb: string): Disk {
    return new Disk({
      diskName,
      path,
      sizeInGb,
      isSystemDisk: true,
    });
  }

  /**
   * Create a data disk.
   */
  public static dataDisk(diskName: string, path: string, sizeInGb: string, iops?: number): Disk {
    return new Disk({
      diskName,
      path,
      sizeInGb,
      isSystemDisk: false,
      iops,
    });
  }

  /**
   * The resources to which the disk is attached.
   */
  public readonly attachedTo?: string;

  /**
   * (Deprecated) The attachment state of the disk.
   */
  public readonly attachmentState?: string;

  /**
   * The unique name of the disk.
   */
  public readonly diskName: string;

  /**
   * The input/output operations per second (IOPS) of the disk.
   */
  public readonly iops?: number;

  /**
   * A Boolean value indicating whether this disk is a system disk.
   */
  public readonly isSystemDisk?: boolean;

  /**
   * The disk path.
   */
  public readonly path: string;

  /**
   * The size of the disk in GB.
   */
  public readonly sizeInGb?: string;

  constructor(props: DiskProps) {
    this.attachedTo = props.attachedTo;
    this.attachmentState = props.attachmentState;
    this.diskName = props.diskName;
    this.iops = props.iops;
    this.isSystemDisk = props.isSystemDisk ?? false;
    this.path = props.path;
    this.sizeInGb = props.sizeInGb;
  }

  /**
   * Render the Disk as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.DiskProperty {
    return {
      attachedTo: this.attachedTo,
      attachmentState: this.attachmentState,
      diskName: this.diskName,
      iops: this.iops,
      isSystemDisk: this.isSystemDisk,
      path: this.path,
      sizeInGb: this.sizeInGb,
    };
  }
}

/**
 * The properties for the Hardware.
 */
export interface HardwareProps {
  /**
   * The number of vCPUs the instance has.
   *
   * @remarks
   * This property is read-only and should not be specified in a create instance or update instance request.
   */
  readonly cpuCount?: number;

  /**
   * The disks attached to the instance.
   *
   * @remarks
   * The instance restarts when performing an attach disk or detach disk request.
   * This resets the public IP address of your instance if a static IP isn't attached to it.
   */
  readonly disks?: Disk[];

  /**
   * The amount of RAM in GB on the instance.
   *
   * @remarks
   * This property is read-only and should not be specified in a create instance or update instance request.
   */
  readonly ramSizeInGb?: number;
}

/**
 * Represents the hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
 */
export class Hardware {
  /**
   * Create a basic hardware configuration.
   */
  public static basic(systemDiskSize: string, dataDiskSizes: string[] = []): Hardware {
    const disks: Disk[] = [];

    // Add system disk
    disks.push(Disk.systemDisk('Disk1', '/dev/xvda', systemDiskSize));

    // Add data disks
    dataDiskSizes.forEach((size, index) => {
      disks.push(
        Disk.dataDisk(
          `Disk${index + 2}`,
          `/dev/xvd${String.fromCharCode(98 + index)}`, // /dev/xvdb, /dev/xvdc, etc.
          size,
        ),
      );
    });
    return new Hardware({ disks });
  }

  /**
   * The number of vCPUs the instance has.
   */
  public readonly cpuCount?: number;

  /**
   * The disks attached to the instance.
   */
  public readonly disks?: Disk[];

  /**
   * The amount of RAM in GB on the instance.
   */
  public readonly ramSizeInGb?: number;

  constructor(props: HardwareProps = {}) {
    this.cpuCount = props.cpuCount;
    this.disks = props.disks;
    this.ramSizeInGb = props.ramSizeInGb;
  }

  /**
   * Render the Hardware as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.HardwareProperty {
    return {
      cpuCount: this.cpuCount,
      disks: this.disks?.map(disk => disk._render()),
      ramSizeInGb: this.ramSizeInGb,
    };
  }
}
