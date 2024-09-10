import React from "react";
import Image from "next/image";

const SuperheroCard = ({ hero }) => {
  return (
    <div className="superheroCard">
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <Image
          src={hero.image}
          alt={hero.name}
          width={400}
          height={192}
          objectFit="cover"
          className="w-full h-48 object-cover"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{hero.name}</div>
        </div>
      </div>
    </div>
  );
};

export default SuperheroCard;
