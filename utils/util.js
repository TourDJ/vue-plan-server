export function generateRandom(min, max){ 
  switch(arguments.length){ 
    case 1: 
      return Math.floor(Math.random()*minNum+1); 
    case 2: 
      return Math.floor(Math.random()*(max-min+1)+min); 
    default: 
      return 0; 
  } 
}

export function datePlus (date, hour) {
  return new Date(date.valueOf() + hour * 60 * 60 * 1000).getTime()
}