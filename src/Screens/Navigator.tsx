import React, { useContext } from 'react';
// import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Home from '~/Screens/Home';
import { StocksContext } from '~/Context/Stocks';
import Loading from '~/Screens/Loading';
import StockAdd from '~/Screens/StockAdd';
import StockModify from '~/Screens/StockModify';
import Settings from '~/Screens/Settings';

const Stack = createStackNavigator();

export default () => {
    const { isLoading } = useContext<IStocksContext>(StocksContext);
    const commonHeader: StackNavigationOptions = { 
        headerBackTitleVisible: false,
        headerTintColor: '#67605b', 
        headerStyle: { backgroundColor: '#fcf7f1' },
        headerTitleStyle: {
            fontFamily: 'NanumBarunpen-bold',
            color: '#67605b',
        },
        headerTitleAlign: 'center'
    }

    if (isLoading) {
        console.log('show Loading...');
        return <Loading />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: true }}>
                <Stack.Screen name="Home" component={Home} options={{
                    title: 'Stock List', 
                    ...commonHeader
                }} />
                <Stack.Screen name="StockAdd" component={StockAdd} options={{ 
                    title: 'Add Stock',
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                    },
                    ...commonHeader
                }} />
                <Stack.Screen name="StockModify" component={StockModify} options={{ 
                    title: 'Modify Stock',
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                    },
                    headerTitleAlign: 'center',
                    ...commonHeader
                }} />
                <Stack.Screen name="Settings" component={Settings} options={{ 
                    title: 'Settings',
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                    },
                    headerTitleAlign: 'center',
                    ...commonHeader
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
