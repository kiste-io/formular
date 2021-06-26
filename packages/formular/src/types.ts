

type DATA = {
    name: string,
    value: string | string[]
}

export type FormData = {
    INPUT: DATA[],
    SELECT: DATA[],
    TEXTAREA: DATA[],     
}


export type FormularData = {
    [key: string]: FormData
  };