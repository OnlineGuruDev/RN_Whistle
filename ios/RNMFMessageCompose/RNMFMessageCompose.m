//
//  RNMFMessage.m
//  whistlenative
//
//  Created by Admin on 12/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#import <MessageUI/MessageUI.h>
#import <Messages/Messages.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNMFMessageCompose, NSObject)

RCT_EXTERN_METHOD(canSendText:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(send:(NSDictionary *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);

@end

