import React, { useEffect } from 'react';
import { StatusBar, AppState } from 'react-native';
import Navigator from '~/Screens/Navigator';
import { StockContextProvider } from '~/Context/Stocks';
import NetInfo from "@react-native-community/netinfo";
import { showAlert } from '~/Utils';
import codePush from 'react-native-code-push'; 

interface Props {}

const App = ({}: Props) => {
  const codePushSync = () =>{
    codePush.sync({
      updateDialog: { //업데이트 다이얼로그 설정
        title : "새로운 업데이트가 존재합니다.",
        optionalUpdateMessage : "지금 업데이트하시겠습니까?",
        optionalIgnoreButtonLabel : "나중에",
        optionalInstallButtonLabel : "업데이트"
      },
      installMode: codePush.InstallMode.IMMEDIATE //즉시 업데이트
    });
  }

  useEffect(() => {
    console.log('========== App : NetInfo.addEventListener');
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type - ", state.type); // none
      console.log("Is connected? - ", state.isConnected); // false
      if (!state.isConnected) {
        showAlert(false, '인터넷 연결을 확인해주세요.', '');
      } else {
        codePushSync();
        AppState.addEventListener("change", (state) => {
          state === "active" && codePushSync();
        });
      }
    });
    return () => {
      unsubscribe();
    }
  }, []);
  
  return (
    <StockContextProvider>
      <StatusBar barStyle="default" />
        <Navigator />
    </StockContextProvider>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
}

// export default App;
export default codePush(codePushOptions)(App)
