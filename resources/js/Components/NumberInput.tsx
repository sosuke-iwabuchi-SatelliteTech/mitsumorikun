import { forwardRef, InputHTMLAttributes } from 'react';
import TextInput from './TextInput';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
}

export default forwardRef(function NumberInput(
    { onFocus, ...props }: Props,
    ref
) {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
        if (onFocus) {
            onFocus(e);
        }
    };

    return (
        <TextInput
            {...props}
            type="number"
            onFocus={handleFocus}
            ref={ref as any}
        />
    );
});
