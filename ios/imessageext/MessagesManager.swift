//
//  MessagesManager.swift
//  imessage.ext
//
//  Created by Admin on 11/26/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

import Messages
import Photos
@objc(MessagesManager)
class MessagesManager: NSObject {
  let messagesVC: MessagesViewController
  static func moduleName() -> String! {
    return "MessagesManager"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  init(messagesVC: MessagesViewController) {
    self.messagesVC = messagesVC
  }
  
  @objc func showLoadingView() {
    DispatchQueue.main.async {
      self.messagesVC.loadingView?.isHidden = false
    }
  }
  
  @objc func hideLoadingView() {
    DispatchQueue.main.async {
      self.messagesVC.loadingView?.isHidden = true
    }
  }
  
  @objc func getPresentationStyle(_ callback: RCTResponseSenderBlock) {
    callback([Mappers.presentationStyleToString(style: self.messagesVC.presentationStyle)])
  }
  
  @objc func updatePresentationStyle(_ style: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let presentationStyle: MSMessagesAppPresentationStyle = (
      style == "compact" ? .compact : .expanded
      
    )
    
    self.messagesVC.requestPresentationStyle(presentationStyle)
    resolve(style)
  }
  
  @objc func getActiveConversation(_ callback: @escaping RCTResponseSenderBlock) {
    guard let conversation = self.messagesVC.activeConversation else {
      return callback([])
    }
    
    callback([
      Mappers.conversationToObject(conversation: conversation),
      conversation.selectedMessage != nil ? Mappers.messageToObject(message: conversation.selectedMessage!) : []
    ])
  }
  
  @objc func composeMessage(_ messageData: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let conversation = self.messagesVC.activeConversation else {
      return reject("ERROR", "There's no conversation", nil)
    }
    
    let url: String = messageData["url"] as! String
    let fileName: String = messageData["fileName"] as! String
    
    saveToDisk(url: url, fileName: fileName, conversation: conversation)
  }
  
  func saveToDisk(url: String, fileName: String, conversation: MSConversation) {
    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let fileURL = documentsDirectory.appendingPathComponent(fileName)
    let session = URLSession.shared
    var request = URLRequest(url: URL(string: url)!)
    request.httpMethod = "GET"
    
    if fileExists(fileName: fileName) {
      conversation.insertAttachment(fileURL, withAlternateFilename: "") {
        (error) in
        if let error = error {
          print("error: \(error.localizedDescription)")
        }
      }
      return
    }
    
    showLoadingView()
    
    _ = session.dataTask(with: request, completionHandler: { (data, response, error) in
      if(error != nil){
        print("\n\nsome error occured\n\n")
        return
      }
      if let response = response as? HTTPURLResponse{
        if response.statusCode == 200{
          DispatchQueue.main.async {
            self.hideLoadingView()
            if let data = data{
              if let _ = try? data.write(to: fileURL, options: Data.WritingOptions.atomic){
                conversation.insertAttachment(fileURL, withAlternateFilename: "") {
                  (error) in
                  if error != nil {
                    //return reject("ERROR", "Unable to insert video", error)
                  }
                }
              }
            }//end if let data
          }//end dispatch main
        }//end if let response.status
      }
    }).resume()
  }
  
  func fileExists(fileName: String) -> Bool {
    let path = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0] as String
    let url = NSURL(fileURLWithPath: path)
    if let pathComponent = url.appendingPathComponent(fileName) {
      let filePath = pathComponent.path
      let fileManager = FileManager.default
      return fileManager.fileExists(atPath: filePath)
    } else {
      return false
    }
  }
}
