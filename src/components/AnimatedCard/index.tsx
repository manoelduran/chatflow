import { useAuth } from '@/src/contexts/auth';
import React, { useEffect, useState } from 'react';

interface AnimatedCardProps {
    name: string;
    totalUsers: number;
    createdBy: string;
    enter: () => void;
    join: () => Promise<void>;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ name, totalUsers, createdBy, enter, join }) => {

    return (
        <div className="w-64 h-32 bg-white rounded-lg shadow-md p-4 transform transition hover:scale-105">
            <div className="flex items-center justify-between ">
            <h2 className="text-lg font-semibold ">{name}</h2>
            <h2 className="text-gray-500">Total Users: {totalUsers}</h2>
            </div>
            <p className="text-gray-500 mb-4">Created by: {createdBy}</p>
            
            <div className="flex justify-around mt-4">
                {  <button onClick={enter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Enter
                </button>}
                <button onClick={join} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Join
                </button>
            </div>
        </div>
    );
};

export default AnimatedCard;