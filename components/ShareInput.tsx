import { Models } from 'node-appwrite';
import React from 'react';

interface Props {
	file: Models.Document;
	onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
	onRemove: (email: string) => void;
}

const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
	return <div>ShareInput</div>;
};

export default ShareInput;
