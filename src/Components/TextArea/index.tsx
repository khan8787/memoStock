import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`display: flex; width: 100%; height: 60px; margin-top: 25px;`;
const LabelContainer = Styled.View`min-width: 100px;`;
const InputContainer = Styled.View`margin-top: 10px;`;
const Label = Styled.Text`font-size: 23px; color: #929292; font-family: 'NanumBarunpen-bold';`;
const InputField = Styled.TextInput`width: 100%; height: 110px; font-size: 23px; line-height: 32px; color: #292929; font-family: 'NanumBarunpen';`;

interface Props {
    label: string,
    value?: string,
    placeholder?: string;
    editable?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    style?: Object;
    clearMode?: boolean;
    inputType: string;
    onChangeText: (text: string, type: string) => void;
}

const TextArea = ({label, placeholder, inputType, value, keyboardType, onChangeText }: Props) => {

    return (
        <Container>
            <LabelContainer>
                <Label>{label}</Label>
            </LabelContainer>
            <InputContainer>
                <InputField
                    multiline={true}
                    numberOfLines={4}
                    value={value}
                    selectionColor="#292929"
                    secureTextEntry={false}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    autoCorrect={false}
                    allowFontScaling={false}
                    placeholderTextColor="#C3C3C3"
                    placeholder={placeholder}
                    clearButtonMode={'while-editing'}
                    onChangeText={ text => onChangeText(text, inputType)}
                />
            </InputContainer>
        </Container>
    )
}

export default TextArea;
