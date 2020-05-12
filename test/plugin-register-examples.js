exports.fullPageWithTopNavTrue = `
plugin.register('wgn', {
    route: '{replace-route}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            topNav: true,
            routes: [
                '/:page'
            ]
        }
    ]
});
`

exports.fullPageWithTopNavTrueRouteReplaced = namespace => `
plugin.register('wgn', {
    route: '${namespace}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            topNav: true,
            routes: [
                '/:page'
            ]
        }
    ]
});
`

exports.fullPageWithTopNavTrueResult = {
  icon: 'icon-mail-squared',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: false
    }
  ]
}

exports.fullPageSettingsAndInline = `
plugin.register('wgn', {
    route: '{replace-route}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            topNav: true,
            routes: [
                '/:page'
            ]
        },
        {
            controller: 'wgnSettingsCntl',
            template: 'wgn-settings',
            type: 'settings'
        },
        {
            controller: 'wgnRecCntl',
            template: 'wgn-rec',
            type: 'inline',
            location:'zn-plugin-form-top'
        }
    ]
});
`

exports.fullPageSettingsAndInlineResult = {
  icon: 'icon-mail-squared',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: false
    },
    {
      type: 'settings',
      src: '/index.html'
    },
    {
      type: 'inline',
      location: 'zn-plugin-form-top',
      src: '/index.html'
    }
  ]
}

exports.fullPageWithTopNavFalse = `
plugin.register('wgn', {
    route: '{replace-route}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            topNav: false,
            routes: [
                '/:page'
            ]
        }
    ]
});
`

exports.fullPageWithTopNavFalseResult = {
  icon: 'icon-mail-squared',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: true
    }
  ]
}

exports.fullPageWithTopNavUndefined = `
plugin.register('wgn', {
    route: '{replace-route}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            routes: [
                '/:page'
            ]
        }
    ]
});
`

exports.fullPageWithTopNavUndefinedResult = {
  icon: 'icon-mail-squared',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: true
    }
  ]
}

exports.fullPageSettingsAndInlineWithSpecifiedSrc = `
plugin.register('wgn', {
    route: '{replace-route}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            topNav: true,
            routes: [
                '/:page'
            ]
        },
        {
            controller: 'wgnSettingsCntl',
            template: 'wgn-settings',
            type: 'settings',
            src: '/settings.html'
        },
        {
            controller: 'wgnRecCntl',
            template: 'wgn-rec',
            type: 'inline',
            location:'zn-plugin-form-top'
        }
    ]
});
`

exports.fullPageSettingsAndInlineWithSpecifiedSrcResult = {
  icon: 'icon-mail-squared',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: false
    },
    {
      type: 'settings',
      src: '/settings.html'
    },
    {
      type: 'inline',
      location: 'zn-plugin-form-top',
      src: '/index.html'
    }
  ]
}

exports.fullPageAndRecordOverlyWithHiddenIcon = `
plugin.register('wgn', {
    route: '{replace-route}',
    title: 'Letter Generator',
    icon: 'icon-mail-squared',
    interfaces: [
        {
            controller: 'wgnCntl',
            template: 'wgn-main',
            type: 'fullPage',
            order: 300,
            topNav: true,
            routes: [
                '/:page'
            ]
        },
        {
            controller: 'wgnRecOverlayCntl',
            template: 'wgn-record-overly',
            type: 'recordOverlay',
            hideIcon: true
        }
    ]
});
`

exports.fullPageAndRecordOverlyWithHiddenIconResult = {
  icon: 'icon-mail-squared',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: false
    },
    {
      type: 'recordOverlay',
      src: '/index.html',
      hideIcon: true
    }
  ]
}

exports.singleInterfaceFullPage = `
plugin.register('kanbanBoard', {
    route: '/kanbanboard',
    controller: 'kanbanBoardCntl',
    template: 'kanban-board-main',
    title: 'Kanban Board',
    pageTitle: 'Kanban Board',
    fullPage: true,
    topNav: true,
    order: 300,
    icon: 'icon-th-large'
});
`

exports.singleInterfaceFullPageResult = {
  icon: 'icon-th-large',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: false
    }
  ]
}

exports.singleInterfaceFullPageHideIcon = `
plugin.register('chat', {
    route: '/chat',
    controller: 'chatCntl',
    template: 'chat-main',
    title: 'Chat',
    pageTitle: false,
    fullPage: true,
    topNav: false,
    order: 300,
    icon: 'icon-chat'
});
`

exports.singleInterfaceFullPageHideIconResult = {
  icon: 'icon-chat',
  views: [
    {
      type: 'fullPage',
      src: '/index.html',
      hideIcon: true
    }
  ]
}

exports.singleInterfaceInline = `
plugin.register('recordNameSearch', {
    route: '/recordnamesearch',
    controller: 'recordNameSearchCntl',
    template: 'record-name-search-main',
    title: 'Record Name Search Plugin',
    pageTitle: false,
    fullPage: false,
    topNav: false,
    order: 300,
    type:'inline',
    location: 'zn-plugin-data-subheader',
    icon:  'icon-zoom-in'
});
`

exports.singleInterfaceInlineResult = {
  icon: 'icon-zoom-in',
  views: [
    {
      type: 'inline',
      src: '/index.html',
      location: 'zn-plugin-data-subheader',
      hideIcon: true
    }
  ]
}

exports.singleInterfaceInlineNoIcon = `
plugin.register('mDReportGenerator', {
    route: '/mdreportgenerator',
    controller: 'mDReportGeneratorCntl',
    template: 'm-d-report-generator-main',
    title: 'MD Report Generator Plugin',
    type: 'inline',
    pageTitle: false,
    fullPage: false,
    topNav: false,
    order: 300,
    location: 'zn-plugin-data-subheader'
});
`

exports.singleInterfaceInlineNoIconResult = {
  views: [
    {
      type: 'inline',
      src: '/index.html',
      location: 'zn-plugin-data-subheader',
      hideIcon: true
    }
  ]
}

exports.fullPageSettingsAndInlineWithDefaultDimensions = `
plugin.register('wgn', {
	title: 'Financial Edge Integrations',
	icon: 'icon-money',
	interfaces: [
		{
			controller: 'wgnSettingsCtrl',
			template: 'wgn-settings',
			type: 'settings',
			defaultDimensions: {
				height: '50px',
				width: '50px'
			}
		},
		{
			controller: 'wgnSettingsCtrl',
			template: 'wgn-settings',
			type: 'inline',
			location: 'zn-plugin-data-subheader',
			'defaultDimensions': {
				'width': '25px',
				'height': '25px'
			}
		}
	]
});
`

exports.fullPageSettingsAndInlineWithDefaultDimensionsResult = {
  views: [
    {
      src: '/index.html',
      type: 'settings',
      defaultDimensions: {
        height: '50px',
        width: '50px'
      }
    },
    {
      src: '/index.html',
      type: 'inline',
      location: 'zn-plugin-data-subheader',
      defaultDimensions: {
        width: '25px',
        height: '25px'
      }
    }
  ],
  icon: 'icon-money'
}
