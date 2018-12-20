import ethUtil from 'ethereumjs-util';
import crypto from 'crypto';
import Tx from 'ethereumjs-tx';
import scrypt from 'scryptsy';
import uuid from 'uuid';

ethUtil.crypto = crypto;
ethUtil.Tx = Tx;
ethUtil.scrypt = scrypt;
ethUtil.uuid = uuid;

export default ethUtil;
