export * from './tokens.type';
export * from './jwtPayload.type';
export * from './jwtPayloadWithRt.type';

/*
 "barrel export" or "barrel pattern" => it's a naming convention and organization technique rather than a formal design pattern.
 In TypeScript, a "barrel" refers to an index.ts file that serves as an entry point for a directory.
 The purpose is to simplify the import syntax and provide a central location for exporting various modules
 or functionalities from that directory
 
 => Hence the naming, akin to having a barrel from which previous exports can be drawn so we take all these functions 
 and put them in a barrel at the top of the barrel to easily grab what we need out of it
 */