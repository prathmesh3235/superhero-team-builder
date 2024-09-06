import React from 'react';

const Modal = ({ hero, onClose }) => {
  if (!hero) return null; // If there's no hero, don't display anything

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl md:max-w-xl w-full">
        <div className="flex flex-col md:flex-row">
          <img src={hero.image} alt={hero.name} className="md:w-1/2 w-full h-auto object-cover rounded" />
          <div className="md:ml-6 mt-4 md:mt-0 md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-white">{hero.fullName || hero.name}</h2>
            <ul className="list-disc pl-5 text-white space-y-2">
              {['intelligence', 'strength', 'speed', 'durability', 'power', 'combat', 'alignment'].map((attr) => (
                <li key={attr}><strong>{attr.charAt(0).toUpperCase() + attr.slice(1)}:</strong> {hero[attr]}</li>
              ))}
            </ul>
            <button onClick={onClose} className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 ease-in-out">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
