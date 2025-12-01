Constructs for the Amazon Lightsail

# Lightsail CDK Construct

This module provides opinionated constructs for [Amazon Lightsail virtual servers](https://**docs**.aws.amazon.com/lightsail/).
It helps you define instances with OS/App blueprints, hardware bundles, networking (commonly used ports), add-ons (AutoSnapshot), and optional user data.

- `Instance`: Create a Lightsail virtual server.
- `Blueprints`: OS and application images (Linux/Windows OS and popular apps like WordPress, LAMP, Node.js).
- `Bundle`: Hardware sizing presets (CPU, memory, IPv6/dual-stack variants).
- `Networking` and `Port`: Convenience helpers for common inbound rules (HTTP/HTTPS/SSH).
- `AddOn`: Configure AutoSnapshot (enabled by default).

## Usage

Import the necessary classes from this module:

```ts
import { App, Stack } from 'aws-cdk-lib';
import { Instance, LinuxOSBlueprint, LinuxAppBlueprint, WindowsOSBlueprint, WindowsAppBlueprint, Bundle, Networking, Port, AddOn } from '@open-constructs/aws-cdk/aws-lightsail';
```

### Basic Example (Linux web server)

```ts
const app = new App();
const stack = new Stack(app, 'LightsailStack');

new Instance(stack, 'WebServer', {
  blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
  bundle: Bundle.MICRO_3_0,
  // Open HTTP/HTTPS. Use webServerWithSsh() to also allow SSH.
  networking: Networking.webServer(),
});
```

### Specify instance name and key pair

```ts
new Instance(stack, 'NamedInstance', {
  instanceName: 'my-lightsail-server',
  blueprint: LinuxOSBlueprint.UBUNTU_22_04,
  bundle: Bundle.SMALL_3_0,
  keyPairName: 'my-keypair', // an existing Lightsail key pair name
  networking: Networking.webServerWithSsh(),
});
```

## Blueprints

Blueprints determine the operating system or pre-installed application image.

- Linux OS: `LinuxOSBlueprint.AMAZON_LINUX_2023`, `AMAZON_LINUX_2`, `UBUNTU_24_04`, `UBUNTU_22_04`, `DEBIAN_12`, `DEBIAN_11`, `FREEBSD_14`, `FREEBSD_13`, `OPENSUSE_15`, `ALMA_LINUX_9`, `CENTOS_8`
- Windows OS: `WindowsOSBlueprint.WINDOWS_SERVER_2022`, `WINDOWS_SERVER_2019`, `WINDOWS_SERVER_2016`
- Linux Apps: `LinuxAppBlueprint.WORDPRESS`, `WORDPRESS_MULTISITE`, `LAMP_8_BITNAMI`, `NODEJS`, `JOOMLA`, `MAGENTO`, `MEAN`, `DRUPAL`, `GITLAB`, `REDMINE`, `NGINX`, `GHOST_BITNAMI`, `DJANGO_BITNAMI`, `PRESTASHOP_BITNAMI`, `PLESK_UBUNTU_BYOL`, `CPANEL_WHM_ALMALINUX`
- Windows Apps: SQL Server–based images are available; use `.of('blueprint-id')` if you need a specific new image ID introduced by AWS.

You can also pass a custom ID via `.of('your-blueprint-id')` when AWS introduces new images:

```ts
const customLinux = LinuxOSBlueprint.of('my_new_linux_image');

new Instance(stack, 'CustomImage', {
  blueprint: customLinux,
  bundle: Bundle.NANO_3_0,
});
```

## Bundles

Bundles define the hardware size (vCPU, memory) and IP stack (dual-stack or IPv6-only).
Representative examples (not exhaustive):

- Dual-stack: `Bundle.NANO_3_0`, `MICRO_3_0`, `SMALL_3_0`, `MEDIUM_3_0`, `LARGE_3_0`, `XLARGE_3_0`, `X2LARGE_3_0`, `X4LARGE_3_0`
- Windows dual-stack: `Bundle.NANO_WIN_3_0`, `MICRO_WIN_3_0`, …
- IPv6-only: `Bundle.NANO_IPV6_3_0`, `MICRO_IPV6_3_0`, … (including Windows variants)

You can also pass a custom bundle ID with `Bundle.of('your-bundle-id')`.

## Networking and Ports

Use `Networking` to open common ports quickly, or define custom ones with `Port`:

```ts
new Instance(stack, 'StrictSshOnly', {
  blueprint: LinuxOSBlueprint.AMAZON_LINUX_2,
  bundle: Bundle.NANO_3_0,
  networking: Networking.sshOnly(),
});

new Instance(stack, 'CustomPorts', {
  blueprint: LinuxOSBlueprint.UBUNTU_24_04,
  bundle: Bundle.SMALL_3_0,
  networking: Networking.custom([
    Port.http(),
    Port.https(),
    Port.ssh(),
  ]),
});
```

## Add-ons (AutoSnapshot)

AutoSnapshot is enabled by default. You can fine-tune or disable it:

```ts
// Enable with custom time (UTC HH:00)
new Instance(stack, 'AutoSnapshotAtMidnight', {
  blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
  bundle: Bundle.MICRO_3_0,
  addOns: [AddOn.autoSnapshot({ snapshotTimeOfDay: '00:00' })],
});

// Disable AutoSnapshot
new Instance(stack, 'NoSnapshots', {
  blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
  bundle: Bundle.MICRO_3_0,
  addOns: [new AddOn({ status: 'Disabled' })],
});
```

## User Data

You can pass EC2-like user data to bootstrap the instance:

```ts
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

const userData = ec2.UserData.forLinux();
userData.addCommands(
  'sudo yum update -y',
  'sudo amazon-linux-extras install nginx1 -y',
  'sudo systemctl enable nginx',
  'sudo systemctl start nginx',
);

new Instance(stack, 'WithUserData', {
  blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
  bundle: Bundle.MEDIUM_3_0,
  networking: Networking.webServer(),
  userData,
});
```

## Instance Attributes

After creation, the following attributes are available on the `Instance`:

- `instanceArn`
- `publicIpAddress`, `privateIpAddress`, `ipv6Addresses`
- `isStaticIp`
- `locationAvailabilityZone`, `locationRegionName`
- `networkingMonthlyTransferGbPerMonthAllocated`

Example:

```ts
const server = new Instance(stack, 'AttrExample', {
  blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
  bundle: Bundle.NANO_3_0,
});

// Use attributes (e.g., to output or reference elsewhere)
server.publicIpAddress; // string
server.instanceArn;     // string
```

## Advanced: Windows and Application Blueprints

```ts
// Windows OS
new Instance(stack, 'WindowsServer', {
  blueprint: WindowsOSBlueprint.WINDOWS_SERVER_2022,
  bundle: Bundle.MEDIUM_WIN_3_0,
  keyPairName: 'my-windows-keypair',
});

// WordPress (Linux App)
new Instance(stack, 'WordPress', {
  blueprint: LinuxAppBlueprint.WORDPRESS,
  bundle: Bundle.MEDIUM_3_0,
  networking: Networking.webServerWithSsh(),
});
```

## Notes

- Instance naming: If `instanceName` is not provided, a unique, lowercased logical name is generated.
- Key pair: `keyPairName` must match an existing Lightsail key pair in your account/region.
- AutoSnapshot time format must be UTC `"HH:00"` (24-hour). Validation is enforced.
- This construct currently focuses on instance creation; additional Lightsail features (e.g., static IP allocation, load balancers) can be composed externally.

## References

- Amazon Lightsail: `https://docs.aws.amazon.com/lightsail/`

