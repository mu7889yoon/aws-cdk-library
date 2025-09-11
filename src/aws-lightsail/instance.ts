import * as cdk from 'aws-cdk-lib';
import { Resource } from 'aws-cdk-lib';
import { UserData } from 'aws-cdk-lib/aws-ec2';
import { CfnInstance, CfnInstanceProps } from 'aws-cdk-lib/aws-lightsail';
import { Construct } from 'constructs';
import { AddOn } from './addon';
import {
  LinuxOSBlueprint,
  WindowsOSBlueprint,
  LinuxAppBlueprint,
  WindowsAppBlueprint,
  BlueprintBase,
} from './blueprints';
import { Bundle } from './bundle';
import { Hardware } from './hardware';
import { Networking } from './networking';

/**
 * Properties for defining a Lightsail Instance.
 */
export interface InstanceProps {
  /**
   * The addons for the lightsail instance.
   *
   * @default - no addons
   */
  readonly addOns?: AddOn[];
  /**
   * The availability zone of the lightsail instance.
   *
   */
  readonly availabilityZone?: string;
  /**
   * The blueprint of the lightsail instance.
   */
  readonly blueprint: LinuxOSBlueprint | WindowsOSBlueprint | LinuxAppBlueprint | WindowsAppBlueprint | BlueprintBase;
  /**
   * The bundle of the lightsail instance.
   */
  readonly bundle: Bundle;
  /**
   * The hardware of the instance.
   */
  readonly hardware?: Hardware;
  /**
   * The instance name.
   *
   * @default - construct id of the Instance
   */
  readonly instanceName?: string;
  /**
   * The key pair name of the lightsail instance.
   */
  readonly keyPairName?: string;
  /**
   * The networking of the lightsail instance.
   */
  readonly networking?: Networking;
  /**
   * The user data of the lightsail instance.
   */
  readonly userData?: UserData;
}

/**
 * The interface of the instance.
 */
export interface IInstance extends cdk.IResource {
  /**
   * The Name of the instance.
   *
   * @attribute
   */
  readonly instanceName: string;
}

/**
 * Represents the lightsail instance.
 */
export class Instance extends Resource implements IInstance {
  /**
   * Import from instance name.
   */
  public static fromInstanceName(scope: Construct, id: string, instanceName: string): IInstance {
    class Import extends cdk.Resource {
      public instanceName = instanceName;
      public instanceArn = cdk.Stack.of(this).formatArn({
        resource: 'Instance',
        service: 'lightsail',
        resourceName: instanceName,
      });
    }
    return new Import(scope, id);
  }
  /**
   * The name of the instance.
   */
  readonly instanceName: string;
  /**
   * The user name for connecting to the instance (for example, ec2-user).
   *
   * @attribute
   */
  readonly instanceUserName: string;
  /**
   * A launch script that installs software on an instance, or configures an instance.
   *
   * @attribute
   */
  readonly instanceUserData?: string;
  /**
   * The support code of the instance.
   * Include this code in your email to support when you have questions about an instance or
   * another resource in Lightsail. This code helps our support team to look up your Lightsail information.
   * @attribute
   */
  readonly instanceSupportCode: string;
  /**
   * The state of the instance (for example, `running` or `pending`).
   *
   * @attribute
   */
  readonly instanceStateName: string;
  /**
   * The status code of the instance.
   *
   * @attribute
   */
  readonly instanceStateCode: number;
  /**
   * The name of the SSH key pair used by the instance.
   *
   * @attribute
   */
  readonly instanceSshKeyName: string;
  /**
   * The resource type of the instance (for example, `Instance`).
   *
   * @attribute
   */
  readonly instanceResourceType: string;
  /**
   * The public IP address of the instance.
   *
   * @attribute
   */
  readonly instancePublicIpAddress: string;
  /**
   * The private IP address of the instance.
   *
   * @attribute
   */
  readonly instancePrivateIpAddress: string;
  /**
   * The amount of allocated monthly data transfer (in GB) for an instance.
   *
   * @attribute
   */
  readonly instanceNetworkingMonthlyTransferGbPerMonthAllocated: string;
  /**
   * The AWS Region of the instance.
   *
   * @attribute
   */
  readonly instanceLocationRegionName: string;
  /**
   * The AWS Region and Availability Zone where the instance is located.
   *
   * @attribute
   */
  readonly instanceLocationAvailabilityZone: string;
  /**
   * The name of the SSH key pair used by the instance.
   *
   * @attribute
   */
  readonly instanceKeyPairName?: string;
  /**
   * Whether the instance has a static IP assigned to it.
   *
   * @attribute
   */
  readonly instanceIsStaticIp: cdk.IResolvable;
  /**
   * The Amazon Resource Name (ARN) of the instance (for example,
   * `arn:aws:lightsail:us-east-2:123456789101:Instance/244ad76f-8aad-4741-809f-12345EXAMPLE`).
   *
   * @attribute
   */
  readonly instanceArn: string;
  /**
   * The amount of RAM in GB on the instance (for example, `1.0`).
   *
   * @attribute
   */
  readonly instanceHardwareRamSizeInGb: number;
  /**
   * The number of vCPUs the instance has.
   *
   * @attribute
   */
  readonly instanceHardwareCpuCount: number;

  private cfnInstanceProps: CfnInstanceProps;
  private readonly props: InstanceProps;

  constructor(scope: Construct, id: string, props: InstanceProps) {
    super(scope, id);
    this.props = props;

    this.cfnInstanceProps = {
      blueprintId: props.blueprint.id,
      bundleId: props.bundle.id,
      instanceName: props.instanceName ?? id,
      addOns: this.renderAddOns(),
      networking: this.renderNetworking(),
      hardware: this.renderHardware(),
    };
    const resource = new CfnInstance(this, 'Resource', this.cfnInstanceProps);

    this.instanceName = resource.instanceName;
    this.instanceUserName = resource.attrUserName;
    this.instanceUserData = resource.userData;
    this.instanceSupportCode = resource.attrSupportCode;
    this.instanceStateName = resource.attrStateName;
    this.instanceStateCode = resource.attrStateCode;
    this.instanceSshKeyName = resource.attrSshKeyName;
    this.instanceResourceType = resource.attrResourceType;
    this.instancePublicIpAddress = resource.attrPublicIpAddress;
    this.instancePrivateIpAddress = resource.attrPrivateIpAddress;
    this.instanceNetworkingMonthlyTransferGbPerMonthAllocated =
      resource.attrNetworkingMonthlyTransferGbPerMonthAllocated;
    this.instanceLocationRegionName = resource.attrLocationRegionName;
    this.instanceLocationAvailabilityZone = resource.attrLocationAvailabilityZone;
    this.instanceKeyPairName = resource.keyPairName;
    this.instanceIsStaticIp = resource.attrIsStaticIp;
    this.instanceArn = resource.attrInstanceArn;
    this.instanceHardwareRamSizeInGb = resource.attrHardwareRamSizeInGb;
    this.instanceHardwareCpuCount = resource.attrHardwareCpuCount;
  }

  /**
   * Render addOns property.
   *
   * @internal
   */
  private renderAddOns(): any[] | undefined {
    return this.props.addOns?.map(addon => addon._render());
  }

  /**
   * Render networking property.
   *
   * @internal
   */
  private renderNetworking(): any | undefined {
    return this.props.networking?._render();
  }

  /**
   * Render hardware property.
   *
   * @internal
   */
  private renderHardware(): any | undefined {
    return this.props.hardware?._render();
  }
}
