import { Template } from 'aws-cdk-lib/assertions';
import { LinuxOSBlueprint, WindowsOSBlueprint, WindowsAppBlueprint, Bundle, Instance, Networking, AddOn, LinuxAppBlueprint, Port } from '../../src/aws-lightsail';
import { App, Stack } from 'aws-cdk-lib';
import { UserData } from 'aws-cdk-lib/aws-ec2';

describe('Lightsail Instance', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', {});
  });

  test('create a Lightsail Instance with minimum properties', () => {
    // WHEN
    new Instance(stack, 'DemoInstance', {
      blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
      bundle: Bundle.SMALL_3_0,
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
      BlueprintId: 'amazon_linux_2023',
      BundleId: 'small_3_0',
    });
  });

  test('create a Lightsail Instance with maximum properties', () => {
    // WHEN
    new Instance(stack, 'DemoInstance', {
      bundle: Bundle.SMALL_3_0,
      blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
      addOns: [AddOn.autoSnapshot()],
      networking: Networking.sshOnly(),
      keyPairName: 'DemoKeyPair',
      instanceName: 'DemoInstance',
      userData: UserData.custom('echo "Test"'),
    });
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
      InstanceName: 'DemoInstance',
      BlueprintId: 'amazon_linux_2023',
      BundleId: 'small_3_0',
      AddOns: [
        {
          Status: 'Enabled',
          AddOnType: 'AutoSnapshot',
          AutoSnapshotAddOnRequest: {
            SnapshotTimeOfDay: '06:00',
          },
        },
      ],
      Networking: {
        Ports: [
          {
            AccessDirection: 'inbound',
            AccessFrom: 'Anywhere (0.0.0.0/0)',
            AccessType: 'Public',
            CidrListAliases: [],
            Cidrs: [],
            CommonName: 'SSH',
            FromPort: 22,
            Protocol: 'tcp',
            ToPort: 22,
          },
        ],
      },
    });
  });

  describe('blueprint test', () => {
    test.each([LinuxOSBlueprint.AMAZON_LINUX_2023, LinuxAppBlueprint.WORDPRESS, WindowsOSBlueprint.WINDOWS_SERVER_2022, WindowsAppBlueprint.WINDOWS_SERVER_2019_SQL_2016_EXPRESS])('create a Lightsail Instance with blueprint', (blueprint) => {
      new Instance(stack, 'DemoInstance', {
        bundle: Bundle.SMALL_3_0,
        blueprint: blueprint,
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
        BlueprintId: blueprint.id,
      });
    });
  });

  describe('validate properties test', () => {
    test('throws an error when snapshotTimeOfDay is not in the format "HH:00"', () => {
      const snapshotTimeOfDayString = '0600';
      expect(() => {
        new Instance(stack, 'DemoInstance', {
          bundle: Bundle.SMALL_3_0,
          blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
          addOns: [AddOn.autoSnapshot({ snapshotTimeOfDay: snapshotTimeOfDayString })],
        });
      }).toThrow(`snapshotTimeOfDay must be in the format "HH:00" (24-hour, UTC), e.g. "06:00" or "18:00". Got: "${snapshotTimeOfDayString}".`);
    })

    test('throws an error when snapshotTimeOfDay is out of range', () => {
      const hourString = '25';
      expect(() => {
        new Instance(stack, 'DemoInstance', {
          bundle: Bundle.SMALL_3_0,
          blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
          addOns: [AddOn.autoSnapshot({ snapshotTimeOfDay: `${hourString}:00` })],
        });
      }).toThrow(`snapshotTimeOfDay hour component must be between 00 and 23. Got: "${hourString}:00".`);
    });
  });

  describe('networking test', () => {
    test('http port', () => {
      new Instance(stack, 'DemoInstance', {
        bundle: Bundle.SMALL_3_0,
        blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
        networking: Networking.custom([Port.http()])
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
        Networking: {
          Ports: [
            {
              AccessDirection: 'inbound',
              AccessFrom: 'Anywhere (0.0.0.0/0)',
              AccessType: 'Public',
              CidrListAliases: [],
              Cidrs: [],
              CommonName: 'HTTP',
              FromPort: 80,
              Protocol: 'tcp',
              ToPort: 80,
            }
          ],
        },
      });
    })

    test('web server network config', () => {
      new Instance(stack, 'DemoInstance', {
        bundle: Bundle.SMALL_3_0,
        blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
        networking: Networking.webServer()
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
        Networking: {
          Ports: [
            {
              AccessDirection: 'inbound',
              AccessFrom: 'Anywhere (0.0.0.0/0)',
              AccessType: 'Public',
              CidrListAliases: [],
              Cidrs: [],
              CommonName: 'HTTP',
              FromPort: 80,
              Protocol: 'tcp',
              ToPort: 80,
            },
            {
              AccessDirection: 'inbound',
              AccessFrom: 'Anywhere (0.0.0.0/0)',
              AccessType: 'Public',
              CidrListAliases: [],
              Cidrs: [],
              CommonName: 'HTTPS',
              FromPort: 443,
              Protocol: 'tcp',
              ToPort: 443,
            }
          ],
        },
      });
    })

    test('web server with ssh network config', () => {
      new Instance(stack, 'DemoInstance', {
        bundle: Bundle.SMALL_3_0,
        blueprint: LinuxOSBlueprint.AMAZON_LINUX_2023,
        networking: Networking.webServerWithSsh()
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
        Networking: {
          Ports: [
            {
              AccessDirection: 'inbound',
              AccessFrom: 'Anywhere (0.0.0.0/0)',
              AccessType: 'Public',
              CidrListAliases: [],
              Cidrs: [],
              CommonName: 'HTTP',
              FromPort: 80,
              Protocol: 'tcp',
              ToPort: 80,
            },
            {
              AccessDirection: 'inbound',
              AccessFrom: 'Anywhere (0.0.0.0/0)',
              AccessType: 'Public',
              CidrListAliases: [],
              Cidrs: [],
              CommonName: 'HTTPS',
              FromPort: 443,
              Protocol: 'tcp',
              ToPort: 443,
            },
            {
              AccessDirection: 'inbound',
              AccessFrom: 'Anywhere (0.0.0.0/0)',
              AccessType: 'Public',
              CidrListAliases: [],
              Cidrs: [],
              CommonName: 'SSH',
              FromPort: 22,
              Protocol: 'tcp',
              ToPort: 22,
            }
          ],
        },
      });
    });
  });
});