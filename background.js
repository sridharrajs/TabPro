browser.commands.onCommand.addListener((command) => {
  browser.tabs.query({})
    .then((tabs) => {
      // intentionally using ==, please read https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/commands/onCommand
      // for more on this.

      const unPinnedTabs = tabs.filter(({ pinned }) => pinned === false);

      const currentTab = tabs.find(({ active }) => active);
      const currentTabIndex = currentTab.index;

      if (command == 'close-all') {
        for (const tab of unPinnedTabs) {
          const tabId = tab.id;
          if (tabId !== currentTab.id) {
            browser.tabs.remove(tabId);
          }
        }
      } else if (command == 'close-right') {
        const tabsToRight = unPinnedTabs.reduce((tabIds, { id: tabId, index }) => {
          if (index > currentTabIndex) {
            tabIds.push(tabId);
          }
          return tabIds;
        }, []);
        browser.tabs.remove(tabsToRight);
      } else if (command == 'close-left') {
        const tabsToLeft = unPinnedTabs.reduce((tabIds, { id: tabId, index }) => {
          if (index < currentTabIndex) {
            tabIds.push(tabId);
          }
          return tabIds;
        }, []);
        browser.tabs.remove(tabsToLeft);
      }
    });

});