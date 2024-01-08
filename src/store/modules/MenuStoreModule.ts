import { Module, GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';

export class MenuInfo {
    public menu:Array<any> = [];
    public activeMenu = "";
}

const getters: GetterTree<MenuInfo, any> = {
    getMenu(state:MenuInfo) {
        return state.menu;
    },
    getActiveMenu(state:MenuInfo) {
        return state.activeMenu;
    }
}

const mutations: MutationTree<MenuInfo> = {
    setMenu(state:MenuInfo, menu:Array<any>) {
        state.menu = menu;
    },
    setActiveMenu(state:MenuInfo, activeMenu:string) {
        state.activeMenu = activeMenu;
    }
}

const actions: ActionTree<MenuInfo, any> = {
    setMenu({ commit}: ActionContext<MenuInfo, any>, menu:Array<any>) {
		commit('setMenu', menu);
	},
    setActiveMenu({ commit }: ActionContext<MenuInfo, any>, activeMenu:string) {
        commit('setActiveMenu', activeMenu);
    }
}

const MenuStoreModule: Module<MenuInfo, any> = {
	namespaced: true,
	state: new MenuInfo(),
	getters,
	mutations,
	actions, 
};

export default MenuStoreModule;