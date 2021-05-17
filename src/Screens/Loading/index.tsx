import React from 'react';
import { ActivityIndicator } from 'react-native';
import Styled from 'styled-components/native';

const Container = Styled.View`flex: 1; background-color: #fcf7f1; align-items: center; justify-content: center;`;

const Loading = () => {
    return (
        <Container>
            <ActivityIndicator color="#ff9922" size="large" />
        </Container>
    )
}

export default Loading;