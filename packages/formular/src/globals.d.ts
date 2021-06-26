import {FormularData} from './types'



declare global {
    interface Window {
        __FORMULAR_DATA__:FormularData;
    }
}
