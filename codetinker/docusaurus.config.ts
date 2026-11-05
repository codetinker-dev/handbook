import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CodeTinker',
  tagline: 'Welcome to the CodeTinker Docs!',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://codetinker-dev.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/handbook/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'codetinker-dev',
  projectName: 'handbook',

  customFields: {
    backendApiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000/v1',
  },

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/codetinker-dev/handbook/tree/master/codetinker/',
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
      
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Codetinker Docs',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'standardSidebar',
          position: 'left',
          label: 'Standard',
        },
        {
          type: 'docSidebar',
          sidebarId: 'obsSdpSidebar',
          position: 'left',
          label: 'OBS-SDP',
        },
        {
          type: 'docSidebar',
          sidebarId: 'server',
          position: 'left',
          label: 'Server',
        },
        {
          type: 'docSidebar',
          sidebarId: 'stickymeSidebar',  // sidebar id in sidebar.js
          position: 'left',
          label: 'StickyMe',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/codetinker-dev/handbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/category/tutorial---docs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            // {
            //   label: 'Twitter',
            //   href: 'https://twitter.com/docusaurus',
            // },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/mycodetinker',
            }
          ],
        },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: '/blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Codetinker, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['markdown',],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
