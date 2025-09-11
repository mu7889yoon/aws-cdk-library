import { CfnInstance } from 'aws-cdk-lib/aws-lightsail';

/**
 * The properties for the AutoSnapshotAddOn.
 *
 * @see https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-configuring-automatic-snapshots.html
 */
export interface AutoSnapshotAddOnProps {
  /**
   * The daily time when an automatic snapshot will be created.
   *
   * Constraints:
   * - Must be in `HH:00` format, and in an hourly increment.
   * - Specified in Coordinated Universal Time (UTC).
   * - The snapshot will be automatically created between the time specified and up to 45 minutes after.
   *
   * @default - "06:00"
   */
  readonly snapshotTimeOfDay?: string;
}

/**
 * Represents the AutoSnapshotAddOn.
 */
export class AutoSnapshotAddOn {
  /**
   * The daily time when an automatic snapshot will be created.
   */
  public readonly snapshotTimeOfDay: string;

  constructor(props: AutoSnapshotAddOnProps = {}) {
    this.snapshotTimeOfDay = props.snapshotTimeOfDay ?? '06:00';
  }

  /**
   * Render the AutoSnapshotAddOn as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.AutoSnapshotAddOnProperty {
    return {
      snapshotTimeOfDay: this.snapshotTimeOfDay,
    };
  }
}

/**
 * The properties for the AddOn.
 */
export interface AddOnProps {
  /**
   * The add-on type.
   *
   * @default - "AutoSnapshot"
   */
  readonly addOnType?: string;
  /**
   * The parameters for the automatic snapshot add-on.
   */
  readonly autoSnapshotAddOnRequest?: AutoSnapshotAddOn;
  /**
   * The status of the add-on.
   *
   * @default - "Enabled"
   */
  readonly status?: 'Enabled' | 'Disabled';
}

/**
 * Represents an AddOn for a Lightsail instance.
 */
export class AddOn {
  /**
   * Create an AutoSnapshot add-on.
   */
  public static autoSnapshot(props: AutoSnapshotAddOnProps = {}): AddOn {
    return new AddOn({
      addOnType: 'AutoSnapshot',
      autoSnapshotAddOnRequest: new AutoSnapshotAddOn(props),
      status: 'Enabled',
    });
  }

  /**
   * The add-on type.
   */
  public readonly addOnType: string;
  /**
   * The parameters for the automatic snapshot add-on.
   */
  public readonly autoSnapshotAddOnRequest?: AutoSnapshotAddOn;
  /**
   * The status of the add-on.
   */
  public readonly status: 'Enabled' | 'Disabled';

  constructor(props: AddOnProps = {}) {
    this.addOnType = props.addOnType ?? 'AutoSnapshot';
    this.autoSnapshotAddOnRequest = props.autoSnapshotAddOnRequest;
    this.status = props.status ?? 'Enabled';
  }

  /**
   * Render the AddOn as a CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnInstance.AddOnProperty {
    return {
      addOnType: this.addOnType,
      autoSnapshotAddOnRequest: this.autoSnapshotAddOnRequest?._render(),
      status: this.status,
    };
  }
}
