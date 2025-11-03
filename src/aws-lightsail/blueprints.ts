/**
 * The Blueprint base object.
 */
export class BlueprintBase {
  /**
   * @param id the blueprint id
   */
  constructor(public readonly id: string) {}
}

/**
 * Blueprint for Windows OS.
 */
export class WindowsOSBlueprint extends BlueprintBase {
  /**
   * windows_server_2022
   */
  public static readonly WINDOWS_SERVER_2022 = WindowsOSBlueprint.of('windows_server_2022');

  /**
   * windows_server_2019
   */
  public static readonly WINDOWS_SERVER_2019 = WindowsOSBlueprint.of('windows_server_2019');

  /**
   * windows_server_2016
   */
  public static readonly WINDOWS_SERVER_2016 = WindowsOSBlueprint.of('windows_server_2016');

  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new WindowsOSBlueprint(id);
  }
}

/**
 * Blueprint for Linux OS.
 */
export class LinuxOSBlueprint extends BlueprintBase {
  /**
   * amazon_linux_2023
   */
  public static readonly AMAZON_LINUX_2023 = LinuxOSBlueprint.of('amazon_linux_2023');

  /**
   * amazon_linux_2
   */
  public static readonly AMAZON_LINUX_2 = LinuxOSBlueprint.of('amazon_linux_2');

  /**
   * ubuntu_24_04
   */
  public static readonly UBUNTU_24_04 = LinuxOSBlueprint.of('ubuntu_24_04');

  /**
   * ubuntu_22_04
   */
  public static readonly UBUNTU_22_04 = LinuxOSBlueprint.of('ubuntu_22_04');

  /**
   * debian_12
   */
  public static readonly DEBIAN_12 = LinuxOSBlueprint.of('debian_12');

  /**
   * debian_11
   */
  public static readonly DEBIAN_11 = LinuxOSBlueprint.of('debian_11');

  /**
   * freebsd_14
   */
  public static readonly FREEBSD_14 = LinuxOSBlueprint.of('freebsd_14');

  /**
   * freebsd_13
   */
  public static readonly FREEBSD_13 = LinuxOSBlueprint.of('freebsd_13');

  /**
   * opensuse_15_2
   */
  public static readonly OPENSUSE_15 = LinuxOSBlueprint.of('opensuse_15');

  /**
   * alma_linux_9
   */
  public static readonly ALMA_LINUX_9 = LinuxOSBlueprint.of('alma_linux_9');

  /**
   * centos_stream_9
   */
  public static readonly CENTOS_8 = LinuxOSBlueprint.of('centos_stream_9');

  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new LinuxOSBlueprint(id);
  }
}

/**
 * Blueprint for Windows App.
 */
export class WindowsAppBlueprint extends BlueprintBase {
  /**
   * windows_server_2022_sql_2016_express
   */
  public static readonly WINDOWS_SERVER_2016_SQL_2022_EXPRESS = WindowsAppBlueprint.of(
    'windows_server_2016_sql_2016_express',
  );

  /**
   * windows_server_2019_sql_2016_express
   */
  public static readonly WINDOWS_SERVER_2019_SQL_2016_EXPRESS = WindowsAppBlueprint.of(
    'windows_server_2019_sql_2016_express',
  );

  /**
   * windows_server_2016_sql_2016_express
   */
  public static readonly WINDOWS_SERVER_2016_SQL_2016_EXPRESS = WindowsAppBlueprint.of(
    'windows_server_2016_sql_2016_express',
  );

  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new WindowsAppBlueprint(id);
  }
}

/**
 * Blueprint for Linux App.
 */
export class LinuxAppBlueprint extends BlueprintBase {
  /**
   * wordpress
   */
  public static readonly WORDPRESS = LinuxAppBlueprint.of('wordpress');

  /**
   * wordpress_multisite
   */
  public static readonly WORDPRESS_MULTISITE = LinuxAppBlueprint.of('wordpress_multisite');

  /**
   * lamp_8_bitnami
   */
  public static readonly LAMP_8_BITNAMI = LinuxAppBlueprint.of('lamp_8_bitnami');

  /**
   * nodejs
   */
  public static readonly NODEJS = LinuxAppBlueprint.of('nodejs');

  /**
   * joomla
   */
  public static readonly JOOMLA = LinuxAppBlueprint.of('joomla');

  /**
   * magento
   */
  public static readonly MAGENTO = LinuxAppBlueprint.of('magento');

  /**
   * mean
   */
  public static readonly MEAN = LinuxAppBlueprint.of('mean');

  /**
   * drupal
   */
  public static readonly DRUPAL = LinuxAppBlueprint.of('drupal');

  /**
   * gitlab
   */
  public static readonly GITLAB = LinuxAppBlueprint.of('gitlab');

  /**
   * redmine
   */
  public static readonly REDMINE = LinuxAppBlueprint.of('redmine');

  /**
   * nginx
   */
  public static readonly NGINX = LinuxAppBlueprint.of('nginx');

  /**
   * ghost_bitnami
   */
  public static readonly GHOST_BITNAMI = LinuxAppBlueprint.of('ghost_bitnami');

  /**
   * django_bitnami
   */
  public static readonly DJANGO_BITNAMI = LinuxAppBlueprint.of('django_bitnami');

  /**
   * prestashop_bitnami
   */
  public static readonly PRESTASHOP_BITNAMI = LinuxAppBlueprint.of('prestashop_bitnami');

  /**
   * plesk_ubuntu_byol
   */
  public static readonly PLESK_UBUNTU_BYOL = LinuxAppBlueprint.of('plesk_ubuntu_byol');

  /**
   * cpanel_whm_almalinux
   */
  public static readonly CPANEL_WHM_ALMALINUX = LinuxAppBlueprint.of('cpanel_whm_almalinux');

  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new LinuxAppBlueprint(id);
  }
}
