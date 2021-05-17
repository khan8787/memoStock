import { Alert } from "react-native";

export const addComma = (text: string): string => {
    const t = text.replace(/,/g,'');
    return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const removeComma = (str: string) => { 
    return str.replace(/\,/g, ''); ; 
}

export const showAlert = (isConfirm: boolean, titleMsg: string, subMsg: string, funcOk?: Function, funcCacenl?: Function) => {
    console.log('Utils showAlert');
    let btnOption = isConfirm ?
    [
        {
            text: "Cancel",
            onPress: () => {
                console.log("Cancel Pressed");
                funcCacenl && funcCacenl();
            },
        },
        { 
            text: "OK", 
            onPress: () => {
                console.log("OK Pressed");
                funcOk && funcOk();
            },
        },
    ] 
    :
    [
        { 
            text: "OK", 
            onPress: () => {
                console.log("OK Pressed");
                funcOk && funcOk();
            }
        },
    ]

    Alert.alert(
        titleMsg,
        subMsg,
        btnOption,
        {
            cancelable: true // work android
        }
    );
}
