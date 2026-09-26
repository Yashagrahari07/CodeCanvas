import React from 'react';
import Avatar from 'react-avatar';
import './styles.css';

const Client = ({ username }) => {
    return (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[#323232]/60 border border-[#8ab180]/20 hover:border-[#55a940] transition-all">
            <div className="relative">
                <Avatar name={username} size={38} round="10px" className="shadow-sm" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#2b2a2a]" />
            </div>
            <span className="font-semibold text-sm text-white truncate max-w-[130px]" title={username}>
                {username}
            </span>
        </div>
    );
};

export default Client;

