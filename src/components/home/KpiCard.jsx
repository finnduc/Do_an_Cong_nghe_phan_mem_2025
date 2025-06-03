"use client";
import React from 'react';

const KpiCard = ({ title, value, icon: IconComponent, iconBgColor, iconColor,  changeText,  }) => {
  return (
    <div className={`
        bg-white px-6 py-8 rounded-lg shadow 
        hover:shadow-lg hover:bg-blue-500 hover:text-white
        transition-all duration-200 ease-in-out
        cursor-pointer group
    `}>
      
      <div className="flex justify-between items-start mb-3"> 
        <p className="text-sm font-medium text-gray-500 group-hover:text-white">{title}</p>
        {IconComponent && (
          <div className={`p-2 rounded-md ${iconBgColor || 'bg-gray-100'} group-hover:bg-transparent`}>
            <IconComponent className={`h-5 w-5 ${iconColor || 'text-gray-700'} group-hover:text-white`} />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 group-hover:text-white mb-4">{value}</p> 
        <div className="flex items-center text-xs">
          <span className="text-gray-500 group-hover:text-white ml-1">{changeText}</span>
        </div>
    </div>
  );
};

export default KpiCard;