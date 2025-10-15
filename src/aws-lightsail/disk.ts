import { IResource, aws_lightsail } from "aws-cdk-lib";

export interface IDisk extends IResource {
    readonly attachedTo?: string;
    readonly attachmentState?: string;
    readonly diskArn: string;
    readonly iops?: number;
    readonly isAttached?: boolean;
    readonly locationAvailabilityZone: string;
    readonly locationRegionName: string;
    readonly path: string;
    readonly resourceType: string;
    readonly state: string;
    readonly supportCode: string;  
  }
  
  export interface DiskProps {
    readonly attachedTo?: string;
    readonly attachmentState?: string;
    readonly diskName: string;
    readonly iops?: number;
    readonly isSystemDisk?: boolean;
    readonly path: string;
    readonly sizeInGb?: string;
  }
  
  export class Disk {
    public readonly attachedTo?: string;
    public readonly attachmentState?: string;
    public readonly diskName: string;
    public readonly iops?: number;
    public readonly isSystemDisk?: boolean;
    public readonly path: string;
    public readonly sizeInGb?: string;
  
    constructor(props: DiskProps) {
      this.attachedTo = props.attachedTo;
      this.attachmentState = props.attachmentState;
      this.diskName = props.diskName;
      this.iops = props.iops;
      this.isSystemDisk = props.isSystemDisk;
      this.path = props.path;
      this.sizeInGb = props.sizeInGb;
    }
  
    public _render(): aws_lightsail.CfnInstance.DiskProperty {
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