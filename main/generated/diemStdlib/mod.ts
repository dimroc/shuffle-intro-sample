
import { Serializer, Deserializer } from '../serde/mod.ts';
import { BcsSerializer, BcsDeserializer } from '../bcs/mod.ts';
import { Optional, Seq, Tuple, ListTuple, unit, bool, int8, int16, int32, int64, int128, uint8, uint16, uint32, uint64, uint128, float32, float64, char, str, bytes } from '../serde/mod.ts';

import * as DiemTypes from '../diemTypes/mod.ts';

/**
 * Structured representation of a call into a known Move script.
 */
export abstract class ScriptCall {
}


export class ScriptCallVariantInitializeNft extends ScriptCall {

constructor (public nft_type: DiemTypes.TypeTag) {
  super();
}

}

export class ScriptCallVariantNewScript extends ScriptCall {

constructor (public nft_type: DiemTypes.TypeTag) {
  super();
}

}

export class ScriptCallVariantSetMessage extends ScriptCall {

constructor (public message: bytes) {
  super();
}

}
/**
 * Structured representation of a call into a known Move script function.
 */
export abstract class ScriptFunctionCall {
}


export class ScriptFunctionCallVariantCreateNft extends ScriptFunctionCall {

constructor (public content_uri: bytes) {
  super();
}

}

export class ScriptFunctionCallVariantSetMessage extends ScriptFunctionCall {

constructor (public message: bytes) {
  super();
}

}

export interface TypeTagDef {
  type: Types;
  arrayType?: TypeTagDef;
  name?: string;
  moduleName?: string;
  address?: string;
  typeParams?: TypeTagDef[];
}

export interface ArgDef {
  readonly name: string;
  readonly type: TypeTagDef;
  readonly choices?: string[];
  readonly mandatory?: boolean;
}

export interface ScriptDef {
  readonly stdlibEncodeFunction: (...args: any[]) => DiemTypes.Script;
  readonly stdlibDecodeFunction: (script: DiemTypes.Script) => ScriptCall;
  readonly codeName: string;
  readonly description: string;
  readonly typeArgs: string[];
  readonly args: ArgDef[];
}

export interface ScriptFunctionDef {
  readonly stdlibEncodeFunction: (...args: any[]) => DiemTypes.TransactionPayload;
  readonly description: string;
  readonly typeArgs: string[];
  readonly args: ArgDef[];
}

export enum Types {
  Boolean,
  U8,
  U64,
  U128,
  Address,
  Array,
  Struct
}


export class Stdlib {
  private static fromHexString(hexString: string): Uint8Array { return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));}

  /**

   */
  static encodeInitializeNftScript(nft_type: DiemTypes.TypeTag): DiemTypes.Script {
    const code = Stdlib.INITIALIZE_NFT_CODE;
    const tyArgs: Seq<DiemTypes.TypeTag> = [nft_type];
    const args: Seq<DiemTypes.TransactionArgument> = [];
    return new DiemTypes.Script(code, tyArgs, args);
  }

  /**

   */
  static encodeNewScriptScript(nft_type: DiemTypes.TypeTag): DiemTypes.Script {
    const code = Stdlib.NEW_SCRIPT_CODE;
    const tyArgs: Seq<DiemTypes.TypeTag> = [nft_type];
    const args: Seq<DiemTypes.TransactionArgument> = [];
    return new DiemTypes.Script(code, tyArgs, args);
  }

  /**

   */
  static encodeSetMessageScript(message: Uint8Array): DiemTypes.Script {
    const code = Stdlib.SET_MESSAGE_CODE;
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    const args: Seq<DiemTypes.TransactionArgument> = [new DiemTypes.TransactionArgumentVariantU8Vector(message)];
    return new DiemTypes.Script(code, tyArgs, args);
  }

  static decodeInitializeNftScript(script: DiemTypes.Script): ScriptCallVariantInitializeNft {
    return new ScriptCallVariantInitializeNft(
      script.ty_args[0]
    );
  }

  static decodeNewScriptScript(script: DiemTypes.Script): ScriptCallVariantNewScript {
    return new ScriptCallVariantNewScript(
      script.ty_args[0]
    );
  }

  static decodeSetMessageScript(script: DiemTypes.Script): ScriptCallVariantSetMessage {
    return new ScriptCallVariantSetMessage(
      (script.args[0] as DiemTypes.TransactionArgumentVariantU8Vector).value
    );
  }

  /**

   */
  static encodeCreateNftScriptFunction(content_uri: Uint8Array): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    serializer.serializeBytes(content_uri);
    const content_uri_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [content_uri_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[36], [22], [58], [252], [198], [227], [59], [10], [148], [115], [133], [46], [24], [50], [127], [169]]), new DiemTypes.Identifier("TestNFT"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("create_nft");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  /**

   */
  static encodeSetMessageScriptFunction(message: Uint8Array): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    serializer.serializeBytes(message);
    const message_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [message_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[36], [22], [58], [252], [198], [227], [59], [10], [148], [115], [133], [46], [24], [50], [127], [169]]), new DiemTypes.Identifier("Message"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("set_message");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  static decodeCreateNftScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantCreateNft {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const content_uri: Uint8Array = deserializer.deserializeBytes();

      return new ScriptFunctionCallVariantCreateNft(
        content_uri
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static decodeSetMessageScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantSetMessage {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const message: Uint8Array = deserializer.deserializeBytes();

      return new ScriptFunctionCallVariantSetMessage(
        message
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static INITIALIZE_NFT_CODE = Stdlib.fromHexString('a11ceb0b0300000006010002030206040802050a0907130f08221000000001030101060002010c0001090001060c034e46540a696e697469616c697a6524163afcc6e33b0a9473852e18327fa901060001030e00380002');

  static NEW_SCRIPT_CODE = Stdlib.fromHexString('a11ceb0b0300000006010002030206040802050a0907130f08221000000001030101060002010c0001090001060c034e46540a696e697469616c697a6524163afcc6e33b0a9473852e18327fa901060001030e00380002');

  static SET_MESSAGE_CODE = Stdlib.fromHexString('a11ceb0b0300000005010002030205050705070c1408201000000001000100020c0a0200074d6573736167650b7365745f6d65737361676524163afcc6e33b0a9473852e18327fa9000001040b000b01110002');

  static ScriptArgs: {[name: string]: ScriptDef} = {
    InitializeNft: {
      stdlibEncodeFunction: Stdlib.encodeInitializeNftScript,
      stdlibDecodeFunction: Stdlib.decodeInitializeNftScript,
      codeName: 'INITIALIZE_NFT',
      description: "",
      typeArgs: ["nft_type"],
      args: [

      ]
    },
    NewScript: {
      stdlibEncodeFunction: Stdlib.encodeNewScriptScript,
      stdlibDecodeFunction: Stdlib.decodeNewScriptScript,
      codeName: 'NEW_SCRIPT',
      description: "",
      typeArgs: ["nft_type"],
      args: [

      ]
    },
    SetMessage: {
      stdlibEncodeFunction: Stdlib.encodeSetMessageScript,
      stdlibDecodeFunction: Stdlib.decodeSetMessageScript,
      codeName: 'SET_MESSAGE',
      description: "",
      typeArgs: [],
      args: [
    {name: "message", type: {type: Types.Array, arrayType: {type: Types.U8}}}
      ]
    },
  }

  static ScriptFunctionArgs: {[name: string]: ScriptFunctionDef} = {

                CreateNft: {
      stdlibEncodeFunction: Stdlib.encodeCreateNftScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        {name: "content_uri", type: {type: Types.Array, arrayType: {type: Types.U8}}}
      ]
    },
                

                SetMessage: {
      stdlibEncodeFunction: Stdlib.encodeSetMessageScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        {name: "message", type: {type: Types.Array, arrayType: {type: Types.U8}}}
      ]
    },
                
  }

}


export type ScriptDecoders = {
  User: {
    InitializeNft: (type: string, nftType: DiemTypes.TypeTagVariantStruct) => void;
    NewScript: (type: string, nftType: DiemTypes.TypeTagVariantStruct) => void;
    SetMessage: (type: string, message: DiemTypes.TransactionArgumentVariantU8Vector) => void;
    default: (type: keyof ScriptDecoders['User']) => void;
  };
};
