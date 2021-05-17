import React from 'react';
import Styled from 'styled-components/native';

const ValidContainer = Styled.View`position: absolute; top: 0; display: flex; justify-content: center; width: 100%; height: 40px; background: #e6bf73;`;
const ValidText = Styled.Text`font-size: 19px; text-align: center; font-family: 'NanumBarunpen-bold'; color: #FFF;`;

interface Props {
    message: string;
    style?: object;
    isShow: boolean;
}

const InvalidNotiBox = ({message, style, isShow}: Props) => {
    return (
        isShow ?
        <ValidContainer>
            <ValidText style={style}>{message}</ValidText>
        </ValidContainer>
        :
        null
    )
}

export default InvalidNotiBox;